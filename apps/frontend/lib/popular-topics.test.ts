import { describe, expect, it } from 'vitest'
import { TaxonomyTermRef } from '@workspace/ui/models/interfaces/taxonomy-term-ref'
import { popularTopics } from './popular-topics'

const term = (name: string): TaxonomyTermRef => ({
  id: `id-${name}`,
  name,
  slug: name.toLowerCase(),
})

const ANGULAR = term('Angular')
const FIREBASE = term('Firebase')
const SEO = term('SEO')

describe('popularTopics', () => {
  it('ranks tags by how much content carries them', () => {
    const topics = popularTopics(
      [
        { tags: [ANGULAR, FIREBASE] },
        { tags: [ANGULAR] },
        { tags: [ANGULAR, SEO] },
        { tags: [FIREBASE] },
      ],
      3
    )

    expect(topics.map((topic) => topic.term.name)).toEqual([
      'Angular',
      'Firebase',
      'SEO',
    ])
    expect(topics[0]?.count).toBe(3)
  })

  // Equally popular tags would otherwise reorder between builds, so the row
  // would appear to shuffle for no reason a reader can see.
  it('breaks ties alphabetically', () => {
    const topics = popularTopics([{ tags: [SEO, FIREBASE, ANGULAR] }], 3)

    expect(topics.map((topic) => topic.term.name)).toEqual([
      'Angular',
      'Firebase',
      'SEO',
    ])
  })

  it('keeps only the requested number', () => {
    expect(popularTopics([{ tags: [ANGULAR, FIREBASE, SEO] }], 2)).toHaveLength(2)
  })

  it('is empty when nothing is tagged', () => {
    expect(popularTopics([{ tags: [] }, { tags: [] }], 5)).toEqual([])
  })
})
