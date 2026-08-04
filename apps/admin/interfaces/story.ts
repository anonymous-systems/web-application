import type { Story } from '@workspace/ui/models/interfaces/story'

/**
 * The `stories/{id}` document fields written from validated form input: the
 * Story model without its id, resolved author, and service-owned timestamps
 * (`user`, `roles`, and timestamps are added by create/update).
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
>
