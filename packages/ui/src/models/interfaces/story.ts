import type {
  ProblemStatus,
  StoryStatus,
  StoryType,
  StoryVisibility,
} from '../story-constants'
import type { TaxonomyTermRef } from './taxonomy-term-ref'

/**
 * A story (the app's primary content type) as read for display. Serializable —
 * ISO-string timestamps and the author resolved into plain fields — so it
 * crosses the server/client boundary and is shared by the admin app and a future
 * frontend authoring surface. `category` and `tags` are resolved taxonomy
 * terms, linked by id rather than slug; `pending` status
 * is reserved for a future creator-submission flow (admin authoring uses
 * draft/published).
 */
export interface Story {
  id: string
  title: string
  slug: string
  type: StoryType
  status: StoryStatus
  visibility: StoryVisibility
  excerpt: string | null
  content: string | null
  coverImage: string | null
  category: TaxonomyTermRef | null
  tags: TaxonomyTermRef[]
  allowComments: boolean
  featured: boolean
  /** Only meaningful when `type === 'problem'`. */
  problemStatus: ProblemStatus | null
  readTimeMinutes: number | null
  authorUid: string | null
  authorName: string | null
  authorAvatar: string | null
  createdAt: string | null
  updatedAt: string | null
  publishedAt: string | null
}
