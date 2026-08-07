export interface TaxonomyMigrationPlan {
  changed: boolean
  /** New/renamed fields to set. */
  set: Record<string, unknown>
  /** Legacy field names to delete. */
  remove: string[]
  warnings: string[]
}

// Fields the previous app's taxonomy documents used. `stories` was a
// denormalised list of referencing stories, which the current model derives from
// each story's own `tags` array instead.
const LEGACY_FIELDS = ['created', 'updated', 'stories']

/**
 * A slug back into a display name: `google-cloud-run` → `Google Cloud Run`.
 * Only ever a starting point — the admin can rename a term afterwards, and this
 * cannot know that `ssr` should be `SSR`.
 */
export const nameFromSlug = (slug: string): string =>
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

/**
 * Plans the legacy → current conversion for one taxonomy term (a category, tag
 * or technology). Pure, so the logic is unit-tested without Firestore.
 *
 * These collections were never migrated alongside stories and projects, which is
 * why the Tags page showed 4 of 12 in dev and 0 of 78 in prod: `listTerms`
 * ordered by `name`, and Firestore silently omits documents missing the ordered
 * field.
 *
 * Idempotent — a document that already has a `name` yields `changed: false`.
 */
export const planTaxonomyMigration = (
  id: string,
  data: Record<string, unknown>
): TaxonomyMigrationPlan => {
  const empty = { changed: false, set: {}, remove: [], warnings: [] }
  if (typeof data.name === 'string' && data.name.trim() !== '') return empty

  const warnings: string[] = []
  const set: Record<string, unknown> = {}

  // The document id is the slug in the legacy shape, so it is the more reliable
  // source; `slug` is only used when the id somehow isn't one.
  const slug = typeof data.slug === 'string' && data.slug.trim() !== '' ? data.slug : id
  set.name = nameFromSlug(slug)
  if (!data.slug) set.slug = slug

  if (set.name === '') {
    return { changed: false, set: {}, remove: [], warnings: [`${id}: no slug to derive a name from`] }
  }

  warnings.push(`${id}: named "${set.name as string}" from its slug — rename if wrong`)

  // `created`/`updated` become the createdAt/updatedAt the current model uses.
  if ('created' in data) set.createdAt = data.created
  if ('updated' in data) set.updatedAt = data.updated

  const remove = LEGACY_FIELDS.filter((field) => field in data)

  return { changed: true, set, remove, warnings }
}
