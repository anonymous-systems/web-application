export interface StoryMigrationPlan {
  changed: boolean
  /** New fields to set (renamed values). */
  set: Record<string, unknown>
  /** Legacy field names to delete. */
  remove: string[]
  /** Extra categories dropped when folding `categories[]` into one `category`. */
  droppedCategories: string[]
}

// Legacy field → current field; the value carries over unchanged.
const RENAMES: Record<string, string> = {
  byline: 'excerpt',
  image: 'coverImage',
  created: 'createdAt',
  updated: 'updatedAt',
  published: 'publishedAt',
  readTime: 'readTimeMinutes',
}

/**
 * Plans the legacy → current conversion for one story document. Pure, so the
 * migration logic is unit-tested without Firestore: renames legacy fields, folds
 * `categories[]` into a single `category`, and drops the denormalized `author`
 * (the `user` reference stays). Idempotent — a document with no legacy fields
 * yields `changed: false`.
 */
export const planStoryMigration = (
  data: Record<string, unknown>
): StoryMigrationPlan => {
  const set: Record<string, unknown> = {}
  const remove: string[] = []
  let droppedCategories: string[] = []

  for (const [legacy, next] of Object.entries(RENAMES)) {
    if (legacy in data) {
      set[next] = data[legacy] ?? null
      remove.push(legacy)
    }
  }

  if ('categories' in data) {
    const categories = Array.isArray(data.categories)
      ? (data.categories as string[])
      : []
    set.category = categories[0] ?? null
    droppedCategories = categories.slice(1)
    remove.push('categories')
  }

  if ('author' in data) remove.push('author')

  return { changed: remove.length > 0, set, remove, droppedCategories }
}
