import { FieldValue, Timestamp } from "@angular/fire/firestore";

/**
 * @description Represents a Firestore date/time value for storage or
 * retrieval.
 *
 * @example
 * // Update a Firestore document with the current server timestamp.
 * const timestamp: FirestoreTimestamp = FieldValue.serverTimestamp();
 * await firestore.doc('users/userId').update({ lastLogin: timestamp });
 *
 * // Read a Firestore document with a timestamp field.
 * const userSnap = await firestore.doc('users/userId').get();
 * const lastLogin: FirestoreTimestamp = userSnap.get('lastLogin');
 * const lastLoginDate: Date = lastLogin.toDate();
 *
 * @summary When reading from Firestore, you'll typically receive a
 * `Timestamp` object. When writing to Firestore, use
 * `FieldValue.serverTimestamp()` for the current server time..
 *
 * @see ReadFirestoreTimestamp
 * @see WriteFirestoreTimestamp
 */
export type FirestoreTimestamp = ReadFirestoreTimestamp | WriteFirestoreTimestamp;

/** Optional Helper Types for Improved Type Safety (Recommended) */

/**
 * @description Type for representing Firestore date/time values
 * when reading data from Firestore.
 *
 * @example
 * // Read a Firestore document with a timestamp field.
 * const userSnap = await firestore.doc('users/userId').get();
 * const lastLogin: FirestoreTimestamp = userSnap.get('lastLogin');
 * const lastLoginDate: Date = lastLogin.toDate();
 */
export type ReadFirestoreTimestamp = Timestamp;

/**
 * @description Type for representing Firestore date/time values when
 * writing data to Firestore.
 *
 * @example
 * // Update a Firestore document with the current server timestamp.
 * const timestamp: FirestoreTimestamp = FieldValue.serverTimestamp();
 * await firestore.doc('users/userId').update({ lastLogin: timestamp });
 */
export type WriteFirestoreTimestamp = FieldValue;
