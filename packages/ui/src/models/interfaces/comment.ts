/**
 * A comment as shown on a public story or project page. Serializable — ISO-string
 * timestamps and the author resolved into plain fields — so it crosses the
 * server/client boundary.
 *
 * Deliberately not the admin app's `AdminComment`, which flattens comments across
 * the collection group and carries `parentTitle` for the moderation table. That
 * surface answers "which post was this left on"; this one is already on the post.
 */
export interface Comment {
  id: string
  content: string
  authorUid: string | null
  authorName: string | null
  authorAvatar: string | null
  createdAt: string | null
}
