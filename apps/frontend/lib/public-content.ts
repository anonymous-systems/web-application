import type { CollectionReference, Query } from 'firebase-admin/firestore'

interface HasPublishDates {
  publishedAt: string | null
  createdAt: string | null
}

/**
 * Restricts a collection to what the public site may read. Applied at query
 * level rather than after the fact, so draft and private documents never leave
 * Firestore — the same rule guards stories and projects, which share these two
 * fields.
 */
export const publiclyVisible = (collection: CollectionReference): Query =>
  collection
    .where('status', '==', 'published')
    .where('visibility', '==', 'public')

/**
 * Newest first, by publish date and falling back to creation date. The fallback
 * matters for migrated documents, which can lack `publishedAt` entirely.
 */
export const byNewest = (a: HasPublishDates, b: HasPublishDates): number =>
  (b.publishedAt ?? b.createdAt ?? '').localeCompare(
    a.publishedAt ?? a.createdAt ?? ''
  )
