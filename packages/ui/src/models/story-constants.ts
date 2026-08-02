// Controlled vocabularies for stories. The runtime arrays feed form selects,
// filters, and Zod enums; the union types are derived from them so the allowed
// values are defined exactly once.

export const STORY_TYPES = ['article', 'blog', 'snippet', 'problem'] as const
export type StoryType = (typeof STORY_TYPES)[number]

export const STORY_STATUSES = ['draft', 'published', 'pending'] as const
export type StoryStatus = (typeof STORY_STATUSES)[number]

export const STORY_VISIBILITIES = ['public', 'private'] as const
export type StoryVisibility = (typeof STORY_VISIBILITIES)[number]

export const PROBLEM_STATUSES = ['open', 'resolved'] as const
export type ProblemStatus = (typeof PROBLEM_STATUSES)[number]
