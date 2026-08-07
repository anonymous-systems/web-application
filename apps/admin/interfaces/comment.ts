/** A comment can be left on a story or a project; both hold a `comments` subcollection. */
export type CommentParentType = 'story' | 'project'

/**
 * A comment as shown in the admin Comments section. Comments are user-authored
 * and live in a per-parent subcollection (`stories/{id}/comments/{id}` or
 * `projects/{id}/comments/{id}`); this flattens one across the collection group,
 * resolving its author from `users/{uid}` and its parent story or project.
 * Timestamps are ISO strings so they can cross the server/client boundary.
 */
export interface AdminComment {
  id: string
  parentType: CommentParentType
  parentId: string
  parentTitle: string | null
  content: string
  authorUid: string | null
  authorName: string | null
  authorUsername: string | null
  authorAvatar: string | null
  createdAt: string | null
  /**
   * Open reports against this comment. Counted so the moderation table can
   * surface the queue; dismissing marks them reviewed rather than deleting, so
   * a repeat offender's history survives.
   */
  openReports: number
}
