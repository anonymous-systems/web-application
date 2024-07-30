import {inject, Injectable} from '@angular/core';
import {FirestoreService} from '@shared-library';
import {
  FirestoreUser, StorageService, LoggerService, AuthService,
} from '@shared-library';
import {where} from '@angular/fire/firestore';
import {User} from '@angular/fire/auth';

@Injectable({providedIn: 'root'})
export class UserService {
  private firestore = inject(FirestoreService);
  private storage = inject(StorageService);
  private logger = inject(LoggerService);
  private auth = inject(AuthService);

  private readonly USER_COLLECTION = 'users';

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

  getUserAvatarPath = (userId: string, file: File) => {
    const fileExtension = file.name.split('.').pop();

    const avatarFileName = `avatar-${Date.now()}.${fileExtension}`;

    return `users/${userId}/avatars/${avatarFileName}`;
  };

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

      await this.firestore.update<FirestoreUser>(
          `${this.USER_COLLECTION}/${user.uid}`,
          userProfile,
      );
    } catch (error: unknown) {
      this.logger.error('Error updating user:', error);

      throw error;
    }
  }
}
