/**
 * A content category as stored in the Firestore `categories` collection.
 * Timestamps are ISO strings so they can cross the server/client boundary.
 */
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string | null
  updatedAt: string | null
}
