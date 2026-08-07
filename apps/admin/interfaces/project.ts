import type { DocumentReference } from 'firebase-admin/firestore'
import type { Project } from '@workspace/ui/models/interfaces/project'

/**
 * The `projects/{id}` document fields written from validated form input: the
 * Project model without its id, resolved author, and service-owned timestamps
 * (`user`, `roles`, and timestamps are added by create/update).
 *
 * Taxonomy links are stored as references where the read model carries resolved
 * terms — the document holds the link, the term document holds its name.
 */
export type ProjectWriteFields = Omit<
  Project,
  | 'id'
  | 'authorUid'
  | 'authorName'
  | 'authorAvatar'
  | 'createdAt'
  | 'updatedAt'
  | 'publishedAt'
  | 'category'
  | 'tags'
  | 'technologies'
> & {
  category: DocumentReference | null
  tags: DocumentReference[]
  technologies: DocumentReference[]
}
