import {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getFirestore,
  Timestamp,
} from 'firebase-admin/firestore'
import { getFirebaseAdminApp } from '@/app/firebase'
import { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'

export const db = (): Firestore => getFirestore(getFirebaseAdminApp())

/** Converts a Firestore Timestamp to an ISO string, or null for anything else. */
export const toIsoString = (value: unknown): string | null =>
  value instanceof Timestamp ? value.toDate().toISOString() : null

/**
 * Author profiles for documents carrying a `user` reference, deduplicated and
 * fetched in one `getAll` so a list costs a single read however many authors it
 * spans.
 */
export const resolveProfiles = async (
  docs: DocumentSnapshot[]
): Promise<Map<string, UserProfileDoc>> => {
  const refs = new Map<string, DocumentReference>()
  for (const doc of docs) {
    const userRef = doc.data()?.user as DocumentReference | undefined
    if (userRef?.id) refs.set(userRef.id, userRef)
  }

  if (refs.size === 0) return new Map()

  const profiles = new Map<string, UserProfileDoc>()
  const snaps = await db().getAll(...refs.values())
  snaps.forEach((snap) => {
    if (snap.exists) profiles.set(snap.id, snap.data() as UserProfileDoc)
  })

  return profiles
}
