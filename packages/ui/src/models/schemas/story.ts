import { z } from 'zod'
import {
  PROBLEM_STATUSES,
  STORY_STATUSES,
  STORY_TYPES,
  STORY_VISIBILITIES,
} from '../story-constants'

export const STORY_TITLE_MAX = 120
export const STORY_EXCERPT_MAX = 300

/**
 * Create/update form input for a story, shared by the admin action and a future
 * frontend authoring surface so both enforce the same rules. `slug`, timestamps,
 * author, and roles are owned by the service, not user input.
 */
export const storyInputSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title is required.')
      .max(STORY_TITLE_MAX, `Title must be ${STORY_TITLE_MAX} characters or fewer.`),
    type: z.enum(STORY_TYPES).default('article'),
    status: z.enum(STORY_STATUSES).default('draft'),
    visibility: z.enum(STORY_VISIBILITIES).default('public'),
    excerpt: z
      .string()
      .trim()
      .max(STORY_EXCERPT_MAX, `Summary must be ${STORY_EXCERPT_MAX} characters or fewer.`)
      .nullish(),
    content: z.string().nullish(),
    coverImage: z.string().trim().nullish(),
    category: z.string().trim().nullish(),
    tags: z.array(z.string().trim().min(1)).default([]),
    allowComments: z.boolean().default(true),
    featured: z.boolean().default(false),
    problemStatus: z.enum(PROBLEM_STATUSES).nullish(),
  })
  .refine((value) => value.type === 'problem' || value.problemStatus == null, {
    message: 'Only problem stories can have a problem status.',
    path: ['problemStatus'],
  })

export type StoryInput = z.infer<typeof storyInputSchema>
