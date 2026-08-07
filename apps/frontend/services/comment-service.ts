import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  type Firestore,
} from 'firebase/firestore'
import { withServerFirestore } from '@workspace/firebase-config/server-firestore'
import { toComment } from '@workspace/firebase-config/documents'
import { resolveProfiles } from '@/lib/profiles'
import { Comment } from '@workspace/ui/models/interfaces/comment'
import { ReactionType } from '@workspace/ui/models/comment-constants'
import { COLLECTION_FOR, CommentParentType } from '@/lib/comment-parents'

/**
 * The signed-in reader. The ID token matters as much as the uid: a report is
 * readable only by its own author, so the server has to read *as* them —
 * reading anonymously and merely knowing the uid is denied by the rules.
 */
export interface Viewer {
  uid: string
  idToken: string
}

interface ViewerState {
  reaction: ReactionType | null
  reported: boolean
}

/**
 * The viewer's reaction and report for each comment, keyed by comment id.
 *
 * Both are read as a direct `get` rather than a query, because each document's
 * id *is* the viewer's uid — so comments they never touched simply come back
 * missing. Two reads per comment, issued concurrently; a thread is small enough
 * that this stays one round trip in practice.
 *
 * A failed read degrades to "no viewer state" rather than propagating: this is
 * decorative — whether *you* already reacted — so losing it costs an
 * unhighlighted thumb, while throwing once cost the whole article.
 */
const viewerState = async (
  firestore: Firestore,
  commentsPath: string,
  commentIds: string[],
  viewerUid: string
): Promise<Map<string, ViewerState>> => {
  const entries = await Promise.all(
    commentIds.map(async (commentId) => {
      const [reaction, report] = await Promise.all([
        getDoc(
          doc(firestore, commentsPath, commentId, 'reactions', viewerUid)
        ).catch(() => null),
        getDoc(
          doc(firestore, commentsPath, commentId, 'reports', viewerUid)
        ).catch(() => null),
      ])

      return [
        commentId,
        {
          reaction: (reaction?.data()?.type as ReactionType | undefined) ?? null,
          reported: report?.exists() ?? false,
        },
      ] as const
    })
  )

  return new Map(entries)
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
  viewer?: Viewer
): Promise<Comment[]> =>
  withServerFirestore(async (firestore) => {
    const commentsPath = `${COLLECTION_FOR[parentType]}/${parentId}/comments`
    const snapshot = await getDocs(query(collection(firestore, commentsPath)))

    const [profiles, states] = await Promise.all([
      resolveProfiles(
        firestore,
        snapshot.docs.map((document) => document.data())
      ),
      viewer
        ? viewerState(
            firestore,
            commentsPath,
            snapshot.docs.map((document) => document.id),
            viewer.uid
          )
        : Promise.resolve(new Map<string, ViewerState>()),
    ])

    return snapshot.docs
      .map((document) => {
        const state = states.get(document.id)

        return toComment(
          document.id,
          document.data(),
          profiles,
          state?.reaction ?? null,
          state?.reported ?? false
        )
      })
      .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
  }, viewer?.idToken)
