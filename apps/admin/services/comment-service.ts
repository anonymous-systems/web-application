import { DocumentReference, getFirestore } from 'firebase-admin/firestore'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'
import { toIsoString } from '@/lib/firestore'
import { AdminComment } from '@/interfaces/comment'
import { UserProfileDoc } from '@/interfaces/user-profile'
import { ActionResult } from '@/interfaces/action-result'

const UNEXPECTED = 'Something went wrong. Please try again.'

const db = () => getFirestore(getFirebaseAdminApp())

// The author's real name; null when unknown, so the UI can fall back to the
// @username or an "Unknown user" label without this layer knowing about them.
const resolveAuthorName = (profile?: UserProfileDoc): string | null =>
  [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || null

/**
 * Lists every comment across all stories for the moderation view. Server-only
 * (Admin SDK), which bypasses the collection-group read rules. Authors and
 * story titles are each resolved in a single batched read, and comments are
 * sorted newest-first in memory so no collection-group ordering index is
 * required.
 */
export const listComments = async (): Promise<AdminComment[]> => {
  const firestore = db()
  const snapshot = await firestore.collectionGroup('comments').get()

  // Collect the unique author and story references so each is read only once.
  const userRefs = new Map<string, DocumentReference>()
  const storyRefs = new Map<string, DocumentReference>()

  for (const doc of snapshot.docs) {
    const userRef = doc.data().user as DocumentReference | undefined
    if (userRef?.id) userRefs.set(userRef.id, userRef)

    const storyRef = doc.ref.parent.parent
    if (storyRef?.id) storyRefs.set(storyRef.id, storyRef)
  }

  const [userSnaps, storySnaps] = await Promise.all([
    userRefs.size ? firestore.getAll(...userRefs.values()) : Promise.resolve([]),
    storyRefs.size ? firestore.getAll(...storyRefs.values()) : Promise.resolve([]),
  ])

  const profiles = new Map<string, UserProfileDoc>()
  userSnaps.forEach((snap) => {
    if (snap.exists) profiles.set(snap.id, snap.data() as UserProfileDoc)
  })

  const storyTitles = new Map<string, string>()
  storySnaps.forEach((snap) => {
    const title = snap.data()?.title as string | undefined
    if (title) storyTitles.set(snap.id, title)
  })

  return snapshot.docs
    .map((doc): AdminComment => {
      const data = doc.data()
      const userRef = data.user as DocumentReference | undefined
      const storyId = doc.ref.parent.parent?.id ?? ''
      const profile = userRef?.id ? profiles.get(userRef.id) : undefined

      return {
        id: doc.id,
        storyId,
        storyTitle: storyTitles.get(storyId) ?? null,
        content: (data.content as string | undefined) ?? '',
        authorUid: userRef?.id ?? null,
        authorName: resolveAuthorName(profile),
        authorUsername: profile?.username ?? null,
        authorAvatar: profile?.avatar ?? null,
        createdAt: toIsoString(data.createdAt),
      }
    })
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
}

/** Permanently removes a single comment from its story subcollection. */
export const deleteComment = async (
  storyId: string,
  id: string
): Promise<ActionResult> => {
  try {
    await db()
      .collection('stories')
      .doc(storyId)
      .collection('comments')
      .doc(id)
      .delete()

    return { ok: true }
  } catch (error) {
    console.error('Failed to delete comment', error)
    return { ok: false, error: UNEXPECTED }
  }
}
