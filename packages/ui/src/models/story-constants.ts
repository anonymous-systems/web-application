// Controlled vocabularies for stories. The runtime arrays feed form selects,
// filters, and Zod enums; the union types are derived from them so the allowed
// values are defined exactly once.

export const STORY_TYPES = ['article', 'blog', 'snippet', 'problem'] as const
export type StoryType = (typeof STORY_TYPES)[number]

// Display labels for the slugs above. Single source for the strings shown on the
// story card badge and the list filters, so the two can't drift apart.
export const STORY_TYPE_LABELS: Record<StoryType, string> = {
  article: 'Article',
  blog: 'Blog',
  snippet: 'Snippet',
  problem: 'Problem',
}

export const STORY_STATUSES = ['draft', 'published', 'pending'] as const
export type StoryStatus = (typeof STORY_STATUSES)[number]

export const STORY_VISIBILITIES = ['public', 'private'] as const
export type StoryVisibility = (typeof STORY_VISIBILITIES)[number]

export const PROBLEM_STATUSES = ['open', 'resolved'] as const
export type ProblemStatus = (typeof PROBLEM_STATUSES)[number]

export const PROBLEM_STATUS_LABELS: Record<ProblemStatus, string> = {
  open: 'Open',
  resolved: 'Resolved',
}
