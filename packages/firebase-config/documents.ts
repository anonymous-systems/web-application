import { resolveAuthorName } from '@workspace/ui/lib/user-display'
import { slugify } from '@workspace/ui/lib/slug'
import type { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'
import type { Story } from '@workspace/ui/models/interfaces/story'
import type { Project } from '@workspace/ui/models/interfaces/project'
import type { Comment } from '@workspace/ui/models/interfaces/comment'
import type { TaxonomyTermRef } from '@workspace/ui/models/interfaces/taxonomy-term-ref'

/**
 * Raw Firestore document fields. Deliberately plain values rather than a
 * snapshot: this module imports neither SDK, so the admin server (firebase-admin)
 * and the public site (the client SDK, under security rules) share one mapping.
 */
export type DocumentFields = Record<string, unknown>

/** Both SDKs' DocumentReference expose `id`; that is all the mappers need. */
interface ReferenceLike {
  id: string
}

/** Both SDKs' Timestamp expose `toDate()`, but they are different classes. */
interface TimestampLike {
  toDate: () => Date
}

const isReference = (value: unknown): value is ReferenceLike =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as ReferenceLike).id === 'string'

/**
 * A Firestore Timestamp as an ISO string, or null for anything else.
 *
 * Checks for `toDate()` rather than `instanceof Timestamp` on purpose: the admin
 * and client SDKs each ship their own Timestamp class, and an `instanceof` check
 * silently returns false for the other one — nulling every date rather than
 * failing loudly.
 */
export const toIsoString = (value: unknown): string | null =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as TimestampLike).toDate === 'function'
    ? (value as TimestampLike).toDate().toISOString()
    : null

/**
 * Resolves a stored taxonomy link — a reference, or a bare slug on documents
 * predating the reference migration — against the terms the caller supplied.
 *
 * An unresolved link is dropped rather than rendered: a term that no longer
 * exists has no name to show, and a raw id in a chip row is worse than nothing.
 */
const termOf = (
  value: unknown,
  terms: Map<string, TaxonomyTermRef>
): TaxonomyTermRef | null => {
  if (isReference(value)) return terms.get(value.id) ?? null

  // Pre-migration documents stored a string: stories a slug, projects a display
  // name. Terms are keyed by id and slug, so slugifying covers both and the site
  // keeps rendering against a collection the migration has not reached.
  if (typeof value === 'string') {
    return terms.get(value) ?? terms.get(slugify(value)) ?? null
  }

  return null
}

const termsOf = (
  value: unknown,
  terms: Map<string, TaxonomyTermRef>
): TaxonomyTermRef[] =>
  Array.isArray(value)
    ? value
        .map((entry) => termOf(entry, terms))
        .filter((term): term is TaxonomyTermRef => term !== null)
    : []

const authorOf = (
  data: DocumentFields,
  profiles: Map<string, UserProfileDoc>
): Pick<Story, 'authorUid' | 'authorName' | 'authorAvatar' | 'authorUsername'> => {
  const userRef = isReference(data.user) ? data.user : undefined
  const profile = userRef ? profiles.get(userRef.id) : undefined

  return {
    authorUid: userRef?.id ?? null,
    authorName: resolveAuthorName(profile),
    authorAvatar: profile?.avatar ?? null,
    authorUsername: profile?.username ?? null,
  }
}

/**
 * Firestore document → display model, mapped in exactly one place so a field
 * added to the model cannot be missed on one surface and read as null there.
 *
 * Every field is read defensively so legacy and partially-migrated documents
 * never throw — the collections still hold pre-migration shapes.
 */
export const toStory = (
  id: string,
  data: DocumentFields,
  profiles: Map<string, UserProfileDoc>,
  terms: Map<string, TaxonomyTermRef> = new Map()
): Story => ({
  id,
  title: (data.title as string | undefined) ?? '',
  slug: (data.slug as string | undefined) ?? '',
  type: (data.type as Story['type'] | undefined) ?? 'article',
  status: (data.status as Story['status'] | undefined) ?? 'draft',
  visibility: (data.visibility as Story['visibility'] | undefined) ?? 'public',
  excerpt: (data.excerpt as string | undefined) ?? null,
  content: (data.content as string | undefined) ?? null,
  coverImage: (data.coverImage as string | undefined) ?? null,
  category: termOf(data.category, terms),
  tags: termsOf(data.tags, terms),
  allowComments: (data.allowComments as boolean | undefined) ?? true,
  featured: (data.featured as boolean | undefined) ?? false,
  problemStatus:
    (data.problemStatus as Story['problemStatus'] | undefined) ?? null,
  readTimeMinutes: (data.readTimeMinutes as number | undefined) ?? null,
  ...authorOf(data, profiles),
  createdAt: toIsoString(data.createdAt),
  updatedAt: toIsoString(data.updatedAt),
  publishedAt: toIsoString(data.publishedAt),
})

/** Firestore document → display model. See toStory for the shared rationale. */
export const toProject = (
  id: string,
  data: DocumentFields,
  profiles: Map<string, UserProfileDoc>,
  terms: Map<string, TaxonomyTermRef> = new Map()
): Project => ({
  id,
  title: (data.title as string | undefined) ?? '',
  slug: (data.slug as string | undefined) ?? '',
  status: (data.status as Project['status'] | undefined) ?? 'draft',
  visibility: (data.visibility as Project['visibility'] | undefined) ?? 'public',
  excerpt: (data.excerpt as string | undefined) ?? null,
  content: (data.content as string | undefined) ?? null,
  coverImage: (data.coverImage as string | undefined) ?? null,
  category: termOf(data.category, terms),
  tags: termsOf(data.tags, terms),
  technologies: termsOf(data.technologies, terms),
  sourceCodeLink: (data.sourceCodeLink as string | undefined) ?? null,
  livePreviewLink: (data.livePreviewLink as string | undefined) ?? null,
  figmaLink: (data.figmaLink as string | undefined) ?? null,
  developmentStatus:
    (data.developmentStatus as Project['developmentStatus'] | undefined) ?? null,
  featured: (data.featured as boolean | undefined) ?? false,
  allowComments: (data.allowComments as boolean | undefined) ?? true,
  ...authorOf(data, profiles),
  createdAt: toIsoString(data.createdAt),
  updatedAt: toIsoString(data.updatedAt),
  publishedAt: toIsoString(data.publishedAt),
})

/**
 * A comment's denormalised reaction totals, floored at zero.
 *
 * The counters are maintained by a trigger applying increments, so they drift
 * whenever an event happens with no trigger to see it — a reaction created
 * while the function was undeployed is never counted, and the *next* change to
 * it still decrements, driving the total negative. Dev held a `likeCount` of -1
 * against a single dislike for exactly that reason.
 *
 * A count is a cardinality and cannot be below zero, so a negative one is
 * corrupt rather than meaningful. Flooring keeps a wrong number from rendering
 * as an absent one, which is how the drift stayed invisible: the row hides a
 * non-positive count, so -1 and 0 look identical on screen.
 *
 * This bounds the symptom; it does not repair the data. Recompute the totals
 * from the reactions subcollection with `pnpm --filter admin repair:reactions`.
 */
const reactionCounts = (
  data: DocumentFields
): Pick<Comment, 'likeCount' | 'dislikeCount'> => {
  // Absent on comments written before reactions existed, and briefly absent on
  // new ones until the counter trigger runs.
  const count = (value: unknown): number =>
    Math.max(0, (value as number | undefined) ?? 0)

  return {
    likeCount: count(data.likeCount),
    dislikeCount: count(data.dislikeCount),
  }
}

/**
 * Firestore document → display model for a comment. Comments live in a
 * per-parent subcollection, so unlike stories and projects there is no parent
 * reference to resolve — the caller already knows which post it is on.
 */
export const toComment = (
  id: string,
  data: DocumentFields,
  profiles: Map<string, UserProfileDoc>,
  viewerReaction: Comment['viewerReaction'] = null,
  viewerReported = false
): Comment => ({
  id,
  content: (data.content as string | undefined) ?? '',
  ...authorOf(data, profiles),
  createdAt: toIsoString(data.createdAt),
  ...reactionCounts(data),
  viewerReaction,
  viewerReported,
})
