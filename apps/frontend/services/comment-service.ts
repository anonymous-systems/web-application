import { collection, getDocs, query } from 'firebase/firestore'
import { withServerFirestore } from '@workspace/firebase-config/server-firestore'
import { toComment } from '@workspace/firebase-config/documents'
import { resolveProfiles } from '@/lib/profiles'
import { Comment } from '@workspace/ui/models/interfaces/comment'

/** Comments live under the story or project they were left on. */
export type CommentParentType = 'story' | 'project'

const COLLECTION_FOR: Record<CommentParentType, string> = {
  story: 'stories',
  project: 'projects',
}

/**
 * Comments on one story or project, oldest first — a thread reads as a
 * conversation, unlike the newest-first content indexes.
 *
 * Sorted in memory rather than with `orderBy`, because `orderBy` silently omits
 * documents missing the field, which is exactly how the tags collection hid
 * broken data for months. A comment without `createdAt` should still appear.
 */
export const listComments = async (
  parentType: CommentParentType,
  parentId: string
): Promise<Comment[]> =>
  withServerFirestore(async (firestore) => {
    const snapshot = await getDocs(
      query(
        collection(firestore, COLLECTION_FOR[parentType], parentId, 'comments')
      )
    )

    const profiles = await resolveProfiles(
      firestore,
      snapshot.docs.map((document) => document.data())
    )

    return snapshot.docs
      .map((document) => toComment(document.id, document.data(), profiles))
      .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
  })
