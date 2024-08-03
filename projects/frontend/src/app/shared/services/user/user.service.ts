import {inject, Injectable} from '@angular/core';
import {where} from '@angular/fire/firestore';
import {User} from '@angular/fire/auth';
import {
  AuthService, FirestoreService, LoggerService, StorageService,
} from '@shared-library/services';
import {FirestoreUser} from '@shared-library/interfaces';
import {Router} from '@angular/router';
import {appRoutes} from '../../../app.routes';

@Injectable({providedIn: 'root'})
export class UserService {
  private firestore = inject(FirestoreService);
  private storage = inject(StorageService);
  private logger = inject(LoggerService);
  private auth = inject(AuthService);
  private router = inject(Router);

  private readonly USER_COLLECTION = 'users';

  /**
   * Attempts to sign the user in using Google authentication.
   *
   * @remarks If successful, navigates the user to the specified
   * `successRoute` or the 'sign-up' route if their profile is incomplete.
   *
   * @param {unknown[]} [successRoute] - (Optional) An array of route
   * segments to navigate to upon successful sign-in (if profile is complete).
   *
   * @returns {Promise<void | AuthError>} A Promise that resolves on
   * successful sign-in, or rejects with an AuthError if an error occurs.
   *
   * @throws {Error} If there's an unexpected error during the sign-in or
   * profile check process.
   */
  async signInWithGoogle(successRoute?: unknown[]): Promise<void> {
    try {
      return this.auth.googleLogin().then(async (userCredential) => {
        if (userCredential instanceof Error) {
          throw userCredential;
        }

        const userId = userCredential.user.uid;

        const hasCompletedPofile = await this.hasCompletedProfile(userId);

        if (!hasCompletedPofile) this.router.navigate([appRoutes.signUp]);
        else if (successRoute) this.router.navigate(successRoute);
      });
    } catch (error: unknown) {
      this.logger.error('Error signing in with Google:', error);

      throw error;
    }
  }

  /**
   * Checks if the user with the given ID has completed their profile.
   *
   * @param {string} userId - The ID of the user to check.
   *
   * @returns {Promise<boolean>} A Promise that resolves with `true` if
   * the profile is complete, `false` otherwise.
   *
   * @throws {Error} If there's an error fetching the user's data from
   * Firestore.
   */
  async hasCompletedProfile(userId: string): Promise<boolean> {
    try {
      const userSnap = await this.firestore.docSnap<FirestoreUser>(
          `${this.USER_COLLECTION}/${userId}`,
      );

      if (!userSnap.exists()) return false;

      const {username, firstName, lastName} = userSnap.data();

      return !!username && !!firstName && !!lastName;
    } catch (error: unknown) {
      this.logger.error('Error checking profile completion:', error);

      throw error;
    }
  }

  /**
   * Retrieves the user data (FirestoreUser) for the given ID.
   *
   * @param {string} id - The ID of the user to fetch.
   *
   * @returns {Promise<FirestoreUser | null>} A Promise that resolves with
   * the user data if found, or `null` if the user does not exist.
   *
   * @throws {Error} If there's an error fetching the user's data from
   * Firestore.
   */
  async getUserById(id: string): Promise<FirestoreUser | null> {
    try {
      const userDocSnap = await this.firestore
          .docSnap<FirestoreUser>(`${this.USER_COLLECTION}/${id}`);

      return userDocSnap.exists() ? userDocSnap.data() : null;
    } catch (error: unknown) {
      this.logger.error('Error fetching user:', error);

      throw error;
    }
  }

  /**
   * Checks if the provided username already exists in the Firestore
   * 'users' collection.
   *
   * @param {string} username - The username to check.
   *
   * @returns {Promise<boolean>} A Promise that resolves with `true` if
   * the username exists, `false` otherwise.
   *
   * @throws {Error} If there's an error querying Firestore.
   */
  async usernameExists(username: string) {
    try {
      const collectionQuerySnapshot =
        await this.firestore.colSnap<FirestoreUser>(
            `users`,
            where('username', '==', username),
        );

      return !collectionQuerySnapshot.empty;
    } catch (error: unknown) {
      this.logger.error('Error checking username:', error);

      throw error;
    }
  }

  /**
   * Uploads the given file as the user's avatar and returns its download URL.
   *
   * @param {string} userId - The ID of the user.
   *
   * @param {File} file - The file to upload as the avatar.
   *
   * @returns {Promise<string>} A Promise resolving to the download URL
   * of the uploaded avatar.
   *
   * @throws {Error} If there's an error during upload or fetching the
   * download URL.
   */
  async uploadAvatar(userId: string, file: File) {
    try {
      const userAvatarPath = this.getUserAvatarPath(userId, file);

      const uploadResult = await this.storage.uploadBytes(
          userAvatarPath, file,
      );

      return await this.storage.getURL(uploadResult.ref);
    } catch (error: unknown) {
      this.logger.error('Error uploading/fetching avatar URL:', error);

      throw error;
    }
  }

  /**
   * Generates a storage path for a user's avatar based on their ID and
   * the file information.
   *
   * @param {string} userId - The ID of the user.
   *
   * @param {File} file - The file object containing the file name and
   * extension.
   *
   * @returns {string} The generated storage path for the avatar.
   */
  getUserAvatarPath = (userId: string, file: File) => {
    const fileExtension = file.name.split('.').pop();

    const avatarFileName = `avatar-${Date.now()}.${fileExtension}`;

    return `users/${userId}/avatars/${avatarFileName}`;
  };

  /**
   * Updates both the user's authentication profile and their
   * Firestore document.
   *
   * @param {User} user - The Firebase User object to update.
   *
   * @param {Partial<FirestoreUser>} userProfile - An object containing
   * the fields to update in both the authentication profile and Firestore.
   *
   * @returns {Promise<void>} A Promise that resolves when both updates
   * are completed successfully.
   *
   * @throws {Error} If an error occurs during either the authentication
   * profile update or the Firestore update.
   */
  async update(user: User, userProfile: Partial<FirestoreUser>) {
    try {
      const firstName =
        userProfile.firstName || user.displayName?.split(' ')[0];

      const lastName =
        userProfile.lastName || user.displayName?.split(' ')[1];

      await this.auth.updateUser(
          user,
          {
            displayName: `${firstName} ${lastName}`,
            photoURL: userProfile.photoURL || user.photoURL,
          },
      );

      await this.firestore.set<FirestoreUser>(
          `${this.USER_COLLECTION}/${user.uid}`,
          userProfile,
          undefined,
          true,
      );
    } catch (error: unknown) {
      this.logger.error('Error updating user:', error);

      throw error;
    }
  }
}
