import { doc, getDoc, type Firestore } from 'firebase/firestore'
import type { DocumentFields } from '@workspace/firebase-config/documents'
import type { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'

/**
 * Author profiles for documents carrying a `user` reference, deduplicated so a
 * list written by one author costs one read however many entries it has.
 *
 * The client SDK has no `getAll()`, so distinct uids are fetched in parallel
 * rather than batched. Readable anonymously because `users/{userUID}` grants
 * unconditional read in firestore.rules.
 */
export const resolveProfiles = async (
  firestore: Firestore,
  documents: DocumentFields[]
): Promise<Map<string, UserProfileDoc>> => {
  const uids = new Set<string>()
  for (const data of documents) {
    const ref = data.user as { id?: unknown } | undefined
    if (typeof ref?.id === 'string') uids.add(ref.id)
  }

  if (uids.size === 0) return new Map()

  const entries = await Promise.all(
    [...uids].map(async (uid) => {
      const snapshot = await getDoc(doc(firestore, 'users', uid))

      return [
        uid,
        snapshot.exists() ? (snapshot.data() as UserProfileDoc) : undefined,
      ] as const
    })
  )

  const profiles = new Map<string, UserProfileDoc>()
  for (const [uid, profile] of entries) {
    if (profile) profiles.set(uid, profile)
  }

  return profiles
}
