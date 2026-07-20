/**
 * A term in a simple taxonomy collection (`categories`, `tags`). Both share the
 * same shape; timestamps are ISO strings so they can cross the server/client
 * boundary.
 */
export interface TaxonomyTerm {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string | null
  updatedAt: string | null
}

/** Firestore collections backed by the shared taxonomy layer. */
export type TaxonomyCollection = 'categories' | 'tags'
