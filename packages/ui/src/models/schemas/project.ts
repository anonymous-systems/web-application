import { z } from 'zod'
import {
  PROJECT_DEVELOPMENT_STATUSES,
  PROJECT_STATUSES,
  PROJECT_VISIBILITIES,
} from '../project-constants'

export const PROJECT_TITLE_MAX = 120
export const PROJECT_EXCERPT_MAX = 300

// An optional external link: blank input becomes null; a non-empty value must be
// a valid URL. Used for the source, live-preview, and Figma links.
const optionalUrl = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? null : value),
  z.string().trim().url('Enter a valid URL.').nullish()
)

/**
 * Create/update form input for a project, shared by the admin action and a
 * future frontend authoring surface so both enforce the same rules. `slug`,
 * timestamps, author, and roles are owned by the service, not user input.
 */
export const projectInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(PROJECT_TITLE_MAX, `Title must be ${PROJECT_TITLE_MAX} characters or fewer.`),
  status: z.enum(PROJECT_STATUSES).default('draft'),
  visibility: z.enum(PROJECT_VISIBILITIES).default('public'),
  excerpt: z
    .string()
    .trim()
    .max(PROJECT_EXCERPT_MAX, `Summary must be ${PROJECT_EXCERPT_MAX} characters or fewer.`)
    .nullish(),
  content: z.string().nullish(),
  coverImage: z.string().trim().nullish(),
  // Taxonomy term document ids. The service turns them into references; a slug
  // would be a copy that goes stale the moment the term is renamed.
  category: z.string().trim().nullish(),
  tags: z.array(z.string().trim().min(1)).default([]),
  technologies: z.array(z.string().trim().min(1)).default([]),
  sourceCodeLink: optionalUrl,
  livePreviewLink: optionalUrl,
  figmaLink: optionalUrl,
  developmentStatus: z.enum(PROJECT_DEVELOPMENT_STATUSES).nullish(),
  allowComments: z.boolean().default(true),
  featured: z.boolean().default(false),
})

export type ProjectInput = z.infer<typeof projectInputSchema>
