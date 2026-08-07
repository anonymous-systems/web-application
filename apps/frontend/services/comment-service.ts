import { collection, doc, getDoc, getDocs, query, type Firestore } from 'firebase/firestore'
import { withServerFirestore } from '@workspace/firebase-config/server-firestore'
import { toComment } from '@workspace/firebase-config/documents'
import { resolveProfiles } from '@/lib/profiles'
import { Comment } from '@workspace/ui/models/interfaces/comment'
import { ReactionType } from '@workspace/ui/models/comment-constants'
import { COLLECTION_FOR, CommentParentType } from '@/lib/comment-parents'


/**
 * How the viewer reacted to each comment, keyed by comment id. Read as one
 * document per comment rather than a query, because a reaction's id *is* the
 * uid — so the lookup is a direct get, and comments the viewer never touched
 * simply come back missing.
 */
const viewerReactions = async (
  firestore: Firestore,
  parentPath: string,
  commentIds: string[],
  viewerUid: string
): Promise<Map<string, ReactionType>> => {
  const entries = await Promise.all(
    commentIds.map(async (commentId) => {
      const snapshot = await getDoc(
        doc(firestore, parentPath, commentId, 'reactions', viewerUid)
      )
      const type = snapshot.data()?.type as ReactionType | undefined

      return [commentId, type] as const
    })
  )

  const reactions = new Map<string, ReactionType>()
  for (const [commentId, type] of entries) {
    if (type) reactions.set(commentId, type)
  }

  return reactions
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
  parentId: string,
  viewerUid?: string
): Promise<Comment[]> =>
  withServerFirestore(async (firestore) => {
    const parentPath = `${COLLECTION_FOR[parentType]}/${parentId}/comments`
    const snapshot = await getDocs(query(collection(firestore, parentPath)))

    const [profiles, reactions] = await Promise.all([
      resolveProfiles(
        firestore,
        snapshot.docs.map((document) => document.data())
      ),
      viewerUid
        ? viewerReactions(
            firestore,
            `${COLLECTION_FOR[parentType]}/${parentId}/comments`,
            snapshot.docs.map((document) => document.id),
            viewerUid
          )
        : Promise.resolve(new Map<string, ReactionType>()),
    ])

    return snapshot.docs
      .map((document) =>
        toComment(
          document.id,
          document.data(),
          profiles,
          reactions.get(document.id) ?? null
        )
      )
      .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
  })
