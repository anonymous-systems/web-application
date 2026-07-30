import { Timestamp } from 'firebase-admin/firestore'

/** Converts a Firestore Timestamp to an ISO string, or null for anything else. */
export const toIsoString = (value: unknown): string | null =>
  value instanceof Timestamp ? value.toDate().toISOString() : null
