import { describe, expect, it } from 'vitest'
import { planStoryMigration } from './story-migration'

describe('planStoryMigration', () => {
  it('renames legacy fields, folds categories, and drops the author', () => {
    const plan = planStoryMigration({
      title: 'Old story',
      byline: 'A summary',
      image: 'https://img/cover.png',
      categories: ['react', 'firebase'],
      created: 'TS_CREATED',
      updated: 'TS_UPDATED',
      published: 'TS_PUBLISHED',
      readTime: 4,
      author: { name: 'Aaron', image: null },
    })

    expect(plan.changed).toBe(true)
    expect(plan.set).toEqual({
      excerpt: 'A summary',
      coverImage: 'https://img/cover.png',
      category: 'react',
      createdAt: 'TS_CREATED',
      updatedAt: 'TS_UPDATED',
      publishedAt: 'TS_PUBLISHED',
      readTimeMinutes: 4,
    })
    expect([...plan.remove].sort()).toEqual(
      [
        'author',
        'byline',
        'categories',
        'created',
        'image',
        'published',
        'readTime',
        'updated',
      ].sort()
    )
    expect(plan.droppedCategories).toEqual(['firebase'])
  })

  it('is a no-op for an already-migrated document', () => {
    const plan = planStoryMigration({
      title: 'New story',
      excerpt: 'A summary',
      coverImage: 'x',
      category: 'react',
      createdAt: 'TS',
      readTimeMinutes: 4,
    })

    expect(plan.changed).toBe(false)
    expect(plan.remove).toEqual([])
    expect(plan.set).toEqual({})
  })

  it('keeps null legacy values and handles a single category', () => {
    const plan = planStoryMigration({ byline: null, categories: ['react'] })

    expect(plan.set.excerpt).toBeNull()
    expect(plan.set.category).toBe('react')
    expect(plan.droppedCategories).toEqual([])
    expect([...plan.remove].sort()).toEqual(['byline', 'categories'])
  })
})
