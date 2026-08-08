import { TaxonomyTermRef } from '@workspace/ui/models/interfaces/taxonomy-term-ref'

/** A tag and how much published content carries it. */
export interface Topic {
  term: TaxonomyTermRef
  count: number
}

/**
 * The most-used tags across a set of content, most first.
 *
 * Derived from what is actually published rather than a hand-kept list: a
 * hardcoded row goes stale the moment a tag is renamed or stops being used, and
 * the home page previously shipped five that matched nothing in the taxonomy.
 *
 * Ties break alphabetically so the row does not reshuffle between builds for
 * tags that are equally popular.
 */
export const popularTopics = (
  tagged: { tags: TaxonomyTermRef[] }[],
  limit: number
): Topic[] => {
  const counts = new Map<string, Topic>()

  for (const item of tagged) {
    for (const term of item.tags) {
      const existing = counts.get(term.id)
      if (existing) existing.count += 1
      else counts.set(term.id, { term, count: 1 })
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.term.name.localeCompare(b.term.name))
    .slice(0, limit)
}
