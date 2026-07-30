/**
 * A comment as shown in the admin Comments section. Comments are user-authored
 * and live in a per-story subcollection (`stories/{storyId}/comments/{id}`);
 * this flattens one across the collection group, resolving its author from
 * `users/{uid}` and its parent story. Timestamps are ISO strings so they can
 * cross the server/client boundary.
 */
export interface AdminComment {
  id: string
  storyId: string
  storyTitle: string | null
  content: string
  authorUid: string | null
  authorName: string | null
  authorUsername: string | null
  authorAvatar: string | null
  createdAt: string | null
}
