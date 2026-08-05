// Controlled vocabularies for projects. The runtime arrays feed form selects,
// filters, and Zod enums; the union types are derived from them so the allowed
// values are defined exactly once.

export const PROJECT_STATUSES = ['draft', 'published', 'archived'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const PROJECT_VISIBILITIES = ['public', 'private'] as const
export type ProjectVisibility = (typeof PROJECT_VISIBILITIES)[number]

// Where a project sits in its lifecycle. Drives the public showcase's
// Active / Planned filters (Active = published and not `planned`).
export const PROJECT_DEVELOPMENT_STATUSES = [
  'planned',
  'in-development',
  'complete',
  'on-hold',
  'cancelled',
] as const
export type ProjectDevelopmentStatus =
  (typeof PROJECT_DEVELOPMENT_STATUSES)[number]

// Display labels for the hyphenated slugs above (CSS capitalize can't title-case
// multi-word values). Shared by the list badge and the form select.
export const PROJECT_DEVELOPMENT_STATUS_LABELS: Record<
  ProjectDevelopmentStatus,
  string
> = {
  planned: 'Planned',
  'in-development': 'In development',
  complete: 'Complete',
  'on-hold': 'On hold',
  cancelled: 'Cancelled',
}
