import { describe, expect, it } from 'vitest'
import {
  missingTerms,
  planTaxonomyLinks,
  type TermIndex,
} from './taxonomy-link-migration'

const index: TermIndex = new Map([
  ['categories', new Map([['web-development', 'catWeb']])],
  [
    'tags',
    new Map([
      ['angular', 'tagAngular'],
      ['firebase', 'tagFirebase'],
    ]),
  ],
  ['technologies', new Map<string, string>()],
])

/** Stands in for a DocumentReference: the planner only checks for a string id. */
const reference = (id: string) => ({ id, path: `tags/${id}` })

describe('planTaxonomyLinks', () => {
  // Migrated stories store slugs.
  it('resolves slug links to their terms', () => {
    const plan = planTaxonomyLinks(
      { category: 'web-development', tags: ['angular', 'firebase'] },
      index
    )

    expect(plan.changed).toBe(true)
    expect(plan.set.category).toEqual({ collection: 'categories', id: 'catWeb' })
    expect(plan.set.tags).toEqual([
      { collection: 'tags', id: 'tagAngular' },
      { collection: 'tags', id: 'tagFirebase' },
    ])
  })

  // Migrated projects store display names where stories store slugs.
  it('resolves display-name links by slugifying them first', () => {
    const plan = planTaxonomyLinks({ tags: ['Angular', 'Firebase'] }, index)

    expect(plan.set.tags).toEqual([
      { collection: 'tags', id: 'tagAngular' },
      { collection: 'tags', id: 'tagFirebase' },
    ])
  })

  it('leaves a field that already holds references alone', () => {
    const plan = planTaxonomyLinks(
      { tags: [reference('tagAngular')], technologies: [] },
      index
    )

    expect(plan.changed).toBe(false)
    expect(plan.set).toEqual({})
  })

  // Half-migrated documents are the state a re-run has to cope with.
  it('rewrites only the fields still holding strings', () => {
    const plan = planTaxonomyLinks(
      { category: 'web-development', tags: [reference('tagAngular')] },
      index
    )

    expect(plan.set.category).toEqual({ collection: 'categories', id: 'catWeb' })
    expect(plan.set.tags).toBeUndefined()
  })

  // The shape a previous run leaves behind when one value had no term: the
  // references it did convert sit beside the value it could not, and a re-run
  // must carry them through rather than rewrite the field without them.
  it('keeps the references already in an array it has to rewrite', () => {
    const plan = planTaxonomyLinks(
      { tags: [reference('tagFirebase'), 'angular'] },
      index
    )

    expect(plan.set.tags).toEqual([
      { collection: 'tags', id: 'tagFirebase' },
      { collection: 'tags', id: 'tagAngular' },
    ])
  })

  it('ignores content with no taxonomy at all', () => {
    expect(planTaxonomyLinks({ title: 'Untagged' }, index).changed).toBe(false)
  })

  // Unreachable once the missing terms exist, so it has to be loud rather than silent.
  it('warns and carries through a link nothing answers to', () => {
    const plan = planTaxonomyLinks({ tags: ['ghost'] }, index)

    expect(plan.set.tags).toEqual([{ unresolved: 'ghost' }])
    expect(plan.warnings).toEqual(['no tags term for "ghost"'])
  })
})

describe('missingTerms', () => {
  // The dev projects hold tags like these that exist only as strings.
  it('names a term for each link with nothing behind it', () => {
    expect(missingTerms({ tags: ['Angular', 'UI Clone'] }, index)).toEqual([
      { collection: 'tags', slug: 'ui-clone', name: 'UI Clone' },
    ])
  })

  // A value that is already a slug was never a display name, so title-case it.
  it('reads a slug-shaped value as a machine name', () => {
    expect(missingTerms({ tags: ['google-cloud-run'] }, index)).toEqual([
      { collection: 'tags', slug: 'google-cloud-run', name: 'Google Cloud Run' },
    ])
  })

  it('finds nothing once the links are references', () => {
    expect(missingTerms({ tags: [reference('tagAngular')] }, index)).toEqual([])
  })

  it('separates the collection each field points into', () => {
    expect(
      missingTerms({ category: 'Design', technologies: ['Vite'] }, index)
    ).toEqual([
      { collection: 'categories', slug: 'design', name: 'Design' },
      { collection: 'technologies', slug: 'vite', name: 'Vite' },
    ])
  })
})
