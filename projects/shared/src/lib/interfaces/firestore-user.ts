import {UserInfo} from '@angular/fire/auth';
import {
  FirestoreDocument,
  ReadFirestoreDocument,
  WriteFirestoreDocument,
} from './firestore-document';

export interface FirestoreUser extends UserInfo, FirestoreDocument {
  username: string | null,
  firstName: string | null,
  lastName: string | null,
}

export type ReadFirestoreUser = FirestoreUser & ReadFirestoreDocument;

export type WriteFirestoreUser = FirestoreUser & WriteFirestoreDocument;
