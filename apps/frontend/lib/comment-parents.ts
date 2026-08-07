/** Comments live under the story or project they were left on. */
export type CommentParentType = 'story' | 'project'

/**
 * Top-level collection for each parent type.
 *
 * Kept out of `services/comment-service.ts` deliberately: client components need
 * these to build a document path, and importing them from the service would drag
 * its whole module graph — including `firebase-admin` via the server Firestore
 * helper — into the browser bundle, which does not build.
 */
export const COLLECTION_FOR: Record<CommentParentType, string> = {
  story: 'stories',
  project: 'projects',
}
