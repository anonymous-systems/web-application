import { slugify } from '@workspace/ui/lib/slug'

export interface ProjectMigrationPlan {
  changed: boolean
  /** New/renamed fields to set. */
  set: Record<string, unknown>
  /** Legacy field names to delete. */
  remove: string[]
  warnings: string[]
}

// Fields the previous anonsys.tech portfolio used that are renamed or dropped.
const LEGACY_FIELDS = ['name', 'description', 'images', 'link', 'github', 'order']

/**
 * Plans the anonsys.tech → current conversion for one project document. Pure, so
 * the logic is unit-tested without Firestore: renames name/description/link/github,
 * takes the first image as the cover, drops `order`, and fills the fields the new
 * model needs (defaulting to published/public, since they were live). The db-aware
 * applier adds timestamps and the owner. Idempotent — a document already on the new
 * shape (has `title`) yields `changed: false`.
 */
export const planProjectMigration = (
  data: Record<string, unknown>
): ProjectMigrationPlan => {
  const isLegacy =
    !('title' in data) && LEGACY_FIELDS.some((field) => field in data)
  if (!isLegacy) return { changed: false, set: {}, remove: [], warnings: [] }

  const warnings: string[] = []
  const name = typeof data.name === 'string' ? data.name : ''
  const images = Array.isArray(data.images) ? (data.images as unknown[]) : []
  if (images.length > 1) {
    warnings.push(`kept the first of ${images.length} images as the cover`)
  }

  const set: Record<string, unknown> = {
    title: name,
    slug: slugify(name),
    excerpt: (data.description as string | undefined) ?? null,
    content: null,
    coverImage: (images[0] as string | undefined) ?? null,
    category: null,
    tags: Array.isArray(data.tags) ? data.tags : [],
    technologies: [],
    sourceCodeLink: (data.github as string | undefined) ?? null,
    livePreviewLink: (data.link as string | undefined) ?? null,
    figmaLink: null,
    developmentStatus: null,
    status: 'published',
    visibility: 'public',
    featured: false,
    allowComments: true,
  }

  const remove = LEGACY_FIELDS.filter((field) => field in data)

  return { changed: true, set, remove, warnings }
}
