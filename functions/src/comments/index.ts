import {
  DocumentData,
  FieldValue,
  getFirestore,
} from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { onDocumentWritten } from 'firebase-functions/firestore'
import { countDelta } from './reaction-counts'

/**
 * A reaction document's type, or null when the document is absent.
 *
 * @param {DocumentData | undefined} data The reaction document's fields.
 * @return {string | null} The reaction type, or null.
 */
const typeOf = (data: DocumentData | undefined): string | null =>
  typeof data?.type === 'string' ? data.type : null

/**
 * Keeps a comment's `likeCount` / `dislikeCount` in step with its `reactions`
 * subcollection. Denormalised so rendering a thread costs no extra reads —
 * counting per comment would be an N+1 on every page load.
 *
 * @param {string} parentPath Path of the comment owning the reaction.
 * @param {DocumentData | undefined} before Reaction fields before the write.
 * @param {DocumentData | undefined} after Reaction fields after the write.
 * @return {Promise<void>} Resolves once the counts are updated.
 */
const onReactionWritten = async (
  parentPath: string,
  before: DocumentData | undefined,
  after: DocumentData | undefined,
): Promise<void> => {
  const delta = countDelta(typeOf(before), typeOf(after))
  if (Object.keys(delta).length === 0) return

  const update = Object.fromEntries(
    Object.entries(delta).map(([field, by]) => [
      field,
      FieldValue.increment(by),
    ]),
  )

  try {
    await getFirestore().doc(parentPath).update(update)
  } catch (error) {
    // The comment may have been deleted between the reaction write and this
    // trigger; there is nothing left to count, so this is not a failure.
    logger.warn('Could not update reaction counts', { parentPath, error })
  }
}

// Two triggers rather than one wildcard: a comment's parent collection is part
// of the path, and stories and projects are separate top-level collections.
export const onStoryCommentReaction = onDocumentWritten(
  'stories/{storyId}/comments/{commentId}/reactions/{uid}',
  async (event) =>
    onReactionWritten(
      `stories/${event.params.storyId}/comments/${event.params.commentId}`,
      event.data?.before.data(),
      event.data?.after.data(),
    ),
)

export const onProjectCommentReaction = onDocumentWritten(
  'projects/{projectId}/comments/{commentId}/reactions/{uid}',
  async (event) =>
    onReactionWritten(
      `projects/${event.params.projectId}/comments/${event.params.commentId}`,
      event.data?.before.data(),
      event.data?.after.data(),
    ),
)
