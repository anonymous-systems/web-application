import type { Project } from '@workspace/ui/models/interfaces/project'

/**
 * The `projects/{id}` document fields written from validated form input: the
 * Project model without its id, resolved author, and service-owned timestamps
 * (`user`, `roles`, and timestamps are added by create/update).
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
>
