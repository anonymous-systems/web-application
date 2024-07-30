import {
  FirestoreTimestamp,
  ReadFirestoreTimestamp, WriteFirestoreTimestamp,
} from './firestore-timestamp';

/**
 * @description Defines the structure of a document in Firestore,
 * including timestamps.
 */
export interface FirestoreDocument {
  created?: FirestoreTimestamp,
  updated?: FirestoreTimestamp,
}

/**
 * @description Defines the structure of a document read from Firestore,
 * with timestamps guaranteed to be of type `Timestamp`.
 */
export interface ReadFirestoreDocument {
  created: ReadFirestoreTimestamp,
  updated?: ReadFirestoreTimestamp,
}

/**
 * @description Defines the structure of a document to be written to
 * Firestore, with timestamps typically specified as `FieldValue` to
 * allow Firestore to automatically set server-side timestamps.
 */
export interface WriteFirestoreDocument {
  created?: WriteFirestoreTimestamp,
  updated?: WriteFirestoreTimestamp,
}
