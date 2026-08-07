import type { DocumentReference } from 'firebase-admin/firestore'
import type { Story } from '@workspace/ui/models/interfaces/story'

/**
 * The `stories/{id}` document fields written from validated form input: the
 * Story model without its id, resolved author, and service-owned timestamps
 * (`user`, `roles`, and timestamps are added by create/update).
 *
 * Taxonomy links are stored as references where the read model carries resolved
 * terms — the document holds the link, the term document holds its name.
 */
export type StoryWriteFields = Omit<
  Story,
  | 'id'
  | 'authorUid'
  | 'authorName'
  | 'authorAvatar'
  | 'createdAt'
  | 'updatedAt'
  | 'publishedAt'
  | 'category'
  | 'tags'
> & {
  category: DocumentReference | null
  tags: DocumentReference[]
}
