import {inject, Injectable} from '@angular/core';
import {
  authState, createUserWithEmailAndPassword,
  signInWithPopup, signOut, updateProfile,
  Auth, AuthError, User, UserCredential,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import {LoggerService} from '../logger/logger.service';
import {NavigationExtras, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {FirestoreUser} from '../../interfaces';
import {FirestoreService} from '../firestore/firestore.service';
import {stringToUsername} from '../../fns';

@Injectable({providedIn: 'root'})
export class AuthService {
  private auth = inject(Auth);
  private logger = inject(LoggerService);
  private router = inject(Router);
  private firestore = inject(FirestoreService);

  readonly USERS_COLLECTION = 'users';

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
   * Signs the user in using Google authentication and navigates to the
   * schedules route.
   *
   * @remarks
   * This method calls `googleLogin()` to initiate the Google sign-in process
   * and, upon successful authentication, redirects the user to the schedules
   * route as defined in the `appRoutes` configuration.
   *
   * @param {unknown[]} successRoute - An array of route segments to
   * navigate on successful sign in.
   * @returns {Promise<UserCredential | AuthError>} A Promise that resolves
   * with the UserCredential if the sign-in is successful, or rejects with
   * an AuthError if it fails.
   */
  async signIn(successRoute?: unknown[]): Promise<void | AuthError> {
    return this.googleLogin().then(() => {
      if (successRoute) this.router.navigate(successRoute);
    });
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
    const provider = new GoogleAuthProvider();

    return signInWithPopup(this.auth, provider)
        .catch((error: AuthError) => {
          this.logger.error(
              `Something went wrong signing in with Google`,
              [error, this.auth, provider],
          );

          return error;
        });
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

  async updateUser(
      user: User,
      {displayName, photoURL}: {
      displayName?: string | null;
      photoURL?: string | null;
    },
  ) {
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
      this.logger.error('Error updating user profile:', error);

      throw error;
    }
  }
}
