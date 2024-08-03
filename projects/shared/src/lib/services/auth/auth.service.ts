import {inject, Injectable} from '@angular/core';
import {
  authState, createUserWithEmailAndPassword,
  signInWithPopup, signOut, updateProfile,
  Auth, AuthError, User, UserCredential,
  GoogleAuthProvider,
  signInWithEmailAndPassword, IdTokenResult, getIdTokenResult,
} from '@angular/fire/auth';
import {LoggerService} from '../logger/logger.service';
import {NavigationExtras, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {FirestoreUser} from '../../interfaces';
import {FirestoreService} from '../firestore/firestore.service';
import {stringToUsername} from '../../functions';

@Injectable({providedIn: 'root'})
export class AuthService {
  private auth = inject(Auth);
  private logger = inject(LoggerService);
  private router = inject(Router);
  private firestore = inject(FirestoreService);

  readonly USERS_COLLECTION: string = 'users';

  /**
   * Retrieves the currently authenticated Firebase user, or
   * null if not signed in.
   *
   * @returns {User | null} The currently authenticated user.
   */
  currentUser = (): User | null => this.auth.currentUser;

  /**
   * Creates an Observable of authentication state changes.
   * It emits only on sign-in or sign-out events.
   *
   * @return {User | null}
   */
  authState$(): Observable<User | null> {
    return authState(this.auth);
  }

  /**
   * Signs the user in using their email and password.
   *
   * @remarks
   * This method attempts to sign in the user with the provided credentials.
   * If successful, it navigates to the specified `successRoute`. Otherwise,
   * it logs an error and rethrows the error.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @param {unknown[]} successRoute - (Optional) An array of route segments
   * to navigate to upon successful sign-in.
   *
   * @returns {Promise<void | AuthError>} A Promise that resolves upon
   * successful sign-in and navigation, or rejects with an AuthError if
   * sign-in fails.
   *
   * @throws {AuthError} If an error occurs during the sign-in process.
   */
  async signInWithEmailAndPassword(
      email: string, password: string, successRoute?: unknown[],
  ): Promise<void | AuthError> {
    try {
      // eslint-disable-next-line max-len
      // await setPersistence(this.auth, { type: rememberMe ? 'LOCAL' : 'SESSION' });

      return signInWithEmailAndPassword(this.auth, email, password)
          .then(() => {
            if (successRoute) this.router.navigate(successRoute);
          });
    } catch (error: unknown) {
      this.logger.error('signInWithEmailAndPassword error', error);

      throw error;
    }
  }

  /**
   * Signs the user in with Google authentication using a pop-up.
   *
   * @remarks
   * If succeeds, returns the signed in user along with the provider's
   * credential. If sign in was unsuccessful, returns an error object
   * containing additional information about the error.
   *
   * @return {Promise<UserCredential | AuthError>} A Promise that resolves
   * with UserCredential upon success, or an AuthError on failure.
   */
  async googleLogin(): Promise<UserCredential | AuthError> {
    try {
      const provider = new GoogleAuthProvider();

      return signInWithPopup(this.auth, provider);
    } catch (error: unknown) {
      this.logger.error(
          'googleLogin error',
          error,
      );

      throw error;
    }
  }

  /**
   * Creates a new user account associated with the specified email address
   * and password.
   *
   * @remarks
   * On successful creation of the user account, this user will also be
   * signed in to your application.
   *
   * User account creation can fail if the account already exists or the
   * password is invalid.
   *
   * Note: The email address acts as a unique identifier for the user and
   * enables an email-based password reset. This function will create a new
   * user account and set the initial user password.
   *
   * @param email - The user's email address.
   * @param password - The user's chosen password.
   */
  async signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          try {
            const userProfile: FirestoreUser = {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
              phoneNumber: user.phoneNumber,
              email: user.email,
              firstName: user.displayName?.split(' ')[0] ?? null,
              lastName: user.displayName?.split(' ')[1] ?? null,
              username: user.displayName ?
              stringToUsername(user.displayName) : null,
              providerId: user.providerId,
            };
            await this.firestore.set<FirestoreUser>(
                `${this.USERS_COLLECTION}/${user.uid}`, userProfile,
            );
          } catch (error: unknown) {
            this.logger.error(
                `Something went wrong saving user profile`, error,
            );
          }

          return userCredential;
        });
  }

  /**
   * Asserts that the current user is signed in.
   * If the user is not authenticated, they are redirected to the sign-in page.
   * This method is intended for use within route guards or other scenarios
   * where authentication is strictly required.
   *
   * @param {User | null} user - The user object to check for authentication
   * status.
   * @param {unknown[]} failRoute - (Optional) An array of route segments
   * @param {NavigationExtras} navigationExtras - (Optional) An object
   * containing additional navigation settings to pass to the sign-in
   * redirect. See {@link NavigationExtras}.
   * @throws {Error} If the user is not signed in, triggering a redirection.
   */
  assertUser(
      user: User | null,
      failRoute?: unknown[],
      navigationExtras?: NavigationExtras,
  ): asserts user {
    if (!user) {
      if (failRoute) this.router.navigate(failRoute, navigationExtras);

      throw new Error(`You must be signed in`);
    }
  }

  /**
   * Signs the current user out.
   *
   * @param {unknown[]} successRoute - An array of route segments to
   * navigate on successful sign out.
   * @return {Promise<void | AuthError>} A Promise that resolves on
   * successful sign out, or rejects with an AuthError on failure.
   */
  async signOut(successRoute?: unknown[]): Promise<void | AuthError> {
    await signOut(this.auth)
        .then(() => {
          this.logger.info(`Signed out`);

          if (successRoute) this.router.navigate(successRoute);
        }).catch((error: AuthError) => {
          this.logger.error(
              `Something went wrong signing out`,
              [error, this.auth],
          );

          return error;
        });
  }

  /**
   * Updates the user's profile information (display name and/or photo URL).
   *
   * @param {User} user - The Firebase User object to update.
   * @param {Object} updates - An object containing the fields to update:
   *   - `displayName` (optional): The new display name for the user.
   *   - `photoURL` (optional): The new photo URL for the user.
   *
   * @returns {Promise<void>} A Promise that resolves upon successful
   * profile update.
   *
   * @throws {Error} If neither `displayName` nor `photoURL` is provided,
   * or if an error occurs during the update process.
   */
  async updateUser(
      user: User,
      {displayName, photoURL}: {
      displayName?: string | null;
      photoURL?: string | null;
    },
  ): Promise<void> {
    try {
      if (!displayName && !photoURL) {
        throw new Error(
            'Expecting display name or photoURL to update user profile',
        );
      }

      const profile: {
        displayName?: string | null;
        photoURL?: string | null;
      } = {};

      if (displayName) profile.displayName = displayName;

      if (photoURL) profile.photoURL = photoURL;

      return await updateProfile(user, profile);
    } catch (error: unknown) {
      this.logger.error('Error caught while updating user profile.', error);

      throw error;
    }
  }

  /**
   * Gets a valid ID Token for the user.
   * Refreshes the token if necessary before returning.
   *
   * @remarks
   * Returns the current token if it has not expired or if it will not
   * expire in the next five minutes. Otherwise, this will refresh the token
   * and return a new one.
   *
   * @param {User} user - The Firebase User to get the ID Token for.
   * @param {boolean} forceRefresh - Forces a refresh even if the current
   * token is valid.
   * @return {Promise<IdTokenResult>} A Promise resolving with the current
   * or refreshed ID Token.
   *
   */
  getUserToken(user: User, forceRefresh?: boolean): Promise<IdTokenResult> {
    return getIdTokenResult(user, forceRefresh);
  }
}
