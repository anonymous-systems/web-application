import { inject, Injectable } from '@angular/core';
import { FirestoreService } from "@shared-library";

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(FirestoreService);

  private readonly USER_COLLECTION = 'users';

  async hasCompletedProfile(userId: string) {
    const userSnap = await this.firestore.docSnap(
      `${this.USER_COLLECTION}/${userId}`,
    );

    if (!userSnap.exists()) return false;

    const { username, firstName, lastName } = userSnap.data();

    return !!username && !!firstName && !!lastName;
  }
}
