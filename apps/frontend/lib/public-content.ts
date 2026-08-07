import {
  collection,
  query,
  where,
  type CollectionReference,
  type Firestore,
  type Query,
} from 'firebase/firestore'

interface HasPublishDates {
  publishedAt: string | null
  createdAt: string | null
}

/**
 * Restricts a collection to what the public site may read: published documents
 * with public visibility, matching `publicStory()` / `publicProject()` in
 * firestore.rules exactly.
 *
 * The match must be exact. Rules authorise rather than filter, so a query that
 * asks for documents the rules disallow is rejected outright instead of being
 * trimmed — a mismatch here fails the whole page, not just the extra documents.
 */
export const publiclyVisible = (
  firestore: Firestore,
  path: 'stories' | 'projects'
): Query => {
  const ref: CollectionReference = collection(firestore, path)

  return query(
    ref,
    where('status', '==', 'published'),
    where('visibility', '==', 'public')
  )
}

/**
 * Newest first, by publish date and falling back to creation date. The fallback
 * matters for migrated documents, which can lack `publishedAt` entirely.
 */
export const byNewest = (a: HasPublishDates, b: HasPublishDates): number =>
  (b.publishedAt ?? b.createdAt ?? '').localeCompare(
    a.publishedAt ?? a.createdAt ?? ''
  )
