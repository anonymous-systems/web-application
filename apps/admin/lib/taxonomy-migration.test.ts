import { describe, expect, it } from 'vitest'
import { nameFromSlug, planTaxonomyMigration } from './taxonomy-migration'

describe('nameFromSlug', () => {
  it('title-cases each hyphenated word', () => {
    expect(nameFromSlug('google-cloud-run')).toBe('Google Cloud Run')
    expect(nameFromSlug('firebase')).toBe('Firebase')
  })

  it('ignores empty segments from stray hyphens', () => {
    expect(nameFromSlug('web--development-')).toBe('Web Development')
  })

  it('is empty for an empty slug', () => {
    expect(nameFromSlug('')).toBe('')
  })
})

describe('planTaxonomyMigration', () => {
  // The real legacy shape from the tags collection.
  const legacy = {
    slug: 'google-cloud-run',
    created: 'stamp',
    updated: 'stamp',
    stories: ['a', 'b'],
  }

  it('derives a name and renames the timestamps', () => {
    const plan = planTaxonomyMigration('google-cloud-run', legacy)

    expect(plan.changed).toBe(true)
    expect(plan.set).toMatchObject({
      name: 'Google Cloud Run',
      createdAt: 'stamp',
      updatedAt: 'stamp',
    })
    expect(plan.remove).toEqual(['created', 'updated', 'stories'])
  })

  // The name is a guess from a slug, so it has to be visible rather than silent.
  it('warns that the derived name may need correcting', () => {
    const plan = planTaxonomyMigration('ssr', { slug: 'ssr' })

    expect(plan.set.name).toBe('Ssr')
    expect(plan.warnings[0]).toContain('rename if wrong')
  })

  it('falls back to the document id when there is no slug field', () => {
    const plan = planTaxonomyMigration('dockerfile', { created: 'stamp' })

    expect(plan.set).toMatchObject({ name: 'Dockerfile', slug: 'dockerfile' })
  })

  // Idempotency: re-running must not rewrite a fully migrated term.
  it('skips a document that is already on the current shape', () => {
    const plan = planTaxonomyMigration('firebase', {
      name: 'Firebase',
      slug: 'firebase',
    })

    expect(plan.changed).toBe(false)
    expect(plan.set).toEqual({})
  })

  // Some legacy terms already carried a name while still holding the legacy
  // timestamps. Treating "has a name" as "already migrated" left four dev tags
  // half-converted — named, but still with created/updated/stories.
  it('still converts a named term that kept its legacy fields', () => {
    const plan = planTaxonomyMigration('angular', {
      name: 'Angular',
      slug: 'angular',
      created: 'stamp',
      updated: 'stamp',
      stories: ['a'],
    })

    expect(plan.changed).toBe(true)
    expect(plan.set).toEqual({ createdAt: 'stamp', updatedAt: 'stamp' })
    expect(plan.remove).toEqual(['created', 'updated', 'stories'])
    // The name is already right, so it must not be re-derived or warned about.
    expect(plan.set.name).toBeUndefined()
    expect(plan.warnings).toEqual([])
  })

  it('skips a document whose name is only whitespace', () => {
    const plan = planTaxonomyMigration('firebase', { name: '   ', slug: 'firebase' })

    expect(plan.changed).toBe(true)
    expect(plan.set.name).toBe('Firebase')
  })

  it('leaves a document with nothing to derive a name from', () => {
    const plan = planTaxonomyMigration('', {})

    expect(plan.changed).toBe(false)
    expect(plan.warnings[0]).toContain('no slug')
  })

  it('keeps an existing slug rather than rewriting it', () => {
    const plan = planTaxonomyMigration('legacy-id', { slug: 'actual-slug' })

    expect(plan.set.name).toBe('Actual Slug')
    expect(plan.set.slug).toBeUndefined()
  })
})
