import { slugify } from '@workspace/ui/lib/slug'
import type { TaxonomyCollection } from './apply-taxonomy-migrations'
import { nameFromSlug } from './taxonomy-migration'

/** Term id by slug and by id, per collection — what a stored link resolves against. */
export type TermIndex = Map<TaxonomyCollection, Map<string, string>>

/** One planned link: the term to point at, or a value nothing answered to. */
export type PlannedLink =
  | { collection: TaxonomyCollection; id: string }
  | { unresolved: string }

export interface TaxonomyLinkPlan {
  changed: boolean
  /** Only the fields needing a rewrite; an absent field is left untouched. */
  set: {
    category?: PlannedLink
    tags?: PlannedLink[]
    technologies?: PlannedLink[]
  }
  warnings: string[]
}

/** A term this content links to that does not exist yet. */
export interface MissingTerm {
  collection: TaxonomyCollection
  slug: string
  name: string
}

/** Each link field on a story or project, and the collection it points into. */
const LINK_FIELDS = {
  category: 'categories',
  tags: 'tags',
  technologies: 'technologies',
} as const satisfies Record<string, TaxonomyCollection>

type LinkField = keyof typeof LINK_FIELDS

/** Both SDKs' DocumentReference expose `id`; that is all this needs to spot one. */
interface ReferenceLike {
  id: string
}

const isReference = (value: unknown): value is ReferenceLike =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as ReferenceLike).id === 'string'

/**
 * What one field currently stores, or null when it needs no rewrite.
 *
 * References already present are returned alongside the strings rather than
 * filtered out: a field can hold both — the previous run leaves an unresolvable
 * value in place beside the links it did convert — and dropping the references
 * would delete those links on the next pass.
 */
const storedLinks = (
  data: Record<string, unknown>,
  field: LinkField
): (string | ReferenceLike)[] | null => {
  const value = data[field]

  if (field === 'category') {
    return typeof value === 'string' && value.trim() !== '' ? [value] : null
  }

  if (!Array.isArray(value) || value.every(isReference)) return null

  return value.filter(
    (entry): entry is string | ReferenceLike =>
      typeof entry === 'string' || isReference(entry)
  )
}

/**
 * The term a stored link names.
 *
 * Looked up by slug because the two collections disagree about what they store:
 * migrated stories hold slugs (`google-cloud-run`) while migrated projects hold
 * display names (`UI Clone`). Slugifying first makes both the same question.
 */
const findTerm = (
  value: string,
  collection: TaxonomyCollection,
  index: TermIndex
): string | undefined => {
  const terms = index.get(collection)

  return terms?.get(slugify(value)) ?? terms?.get(value)
}

/**
 * The terms content links to that were never created.
 *
 * These are real tags in use — six of the dev projects' tags name terms that
 * only ever existed as strings on the project. Creating them keeps the tag
 * visible and puts it in the admin picker; resolving to nothing would quietly
 * delete it from the site.
 */
export const missingTerms = (
  data: Record<string, unknown>,
  index: TermIndex
): MissingTerm[] =>
  Object.entries(LINK_FIELDS).flatMap(([field, collection]) =>
    (storedLinks(data, field as LinkField) ?? [])
      .filter((entry): entry is string => typeof entry === 'string')
      .filter((value) => findTerm(value, collection, index) === undefined)
      .map((value) => ({
        collection,
        slug: slugify(value),
        // A value that is already a slug is a machine name and reads badly as
        // one; anything else was authored as a display name, so keep it.
        name: slugify(value) === value ? nameFromSlug(value) : value.trim(),
      }))
  )

/**
 * Plans the slug → reference conversion of one story or project's taxonomy
 * links. Pure, so the resolution rules are unit-tested without Firestore; the
 * applier turns each `PlannedLink` into a real DocumentReference.
 *
 * Idempotent: a field already holding references is left out of the plan, so a
 * re-run after a partial migration touches only what remains.
 */
export const planTaxonomyLinks = (
  data: Record<string, unknown>,
  index: TermIndex
): TaxonomyLinkPlan => {
  const warnings: string[] = []
  const set: TaxonomyLinkPlan['set'] = {}

  const link = (
    value: string | ReferenceLike,
    collection: TaxonomyCollection
  ): PlannedLink => {
    // Already a link; the field it sits on says which collection it points into.
    if (isReference(value)) return { collection, id: value.id }

    const id = findTerm(value, collection, index)
    if (id) return { collection, id }

    // Unreachable once the missing terms have been created, so reaching it means
    // the run is out of step with the index it was given.
    warnings.push(`no ${collection} term for "${value}"`)

    return { unresolved: value }
  }

  for (const [field, collection] of Object.entries(LINK_FIELDS)) {
    const stored = storedLinks(data, field as LinkField)
    if (!stored) continue

    const links = stored.map((value) => link(value, collection))
    if (field === 'category') set.category = links[0]
    else set[field as 'tags' | 'technologies'] = links
  }

  return { changed: Object.keys(set).length > 0, set, warnings }
}
