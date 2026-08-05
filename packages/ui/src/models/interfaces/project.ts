import type {
  ProjectDevelopmentStatus,
  ProjectStatus,
  ProjectVisibility,
} from '../project-constants'

/**
 * A portfolio project as read for display. Serializable — ISO-string timestamps
 * and the author resolved into plain fields — so it crosses the server/client
 * boundary and is shared by the admin app and the future public showcase.
 * `category`, `tags`, and `technologies` hold slugs. `excerpt` is the short
 * description shown on cards; `content` is the rich-text body of the detail page.
 */
export interface Project {
  id: string
  title: string
  slug: string
  status: ProjectStatus
  visibility: ProjectVisibility
  excerpt: string | null
  content: string | null
  coverImage: string | null
  category: string | null
  tags: string[]
  technologies: string[]
  sourceCodeLink: string | null
  livePreviewLink: string | null
  figmaLink: string | null
  developmentStatus: ProjectDevelopmentStatus | null
  featured: boolean
  allowComments: boolean
  authorUid: string | null
  authorName: string | null
  authorAvatar: string | null
  createdAt: string | null
  updatedAt: string | null
  publishedAt: string | null
}
