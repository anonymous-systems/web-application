import { describe, expect, it } from 'vitest'
import { planProjectMigration } from './project-migration'

describe('planProjectMigration', () => {
  it('renames legacy fields, takes the first image, and fills defaults', () => {
    const plan = planProjectMigration({
      name: 'Portfolio Site',
      description: 'My personal site',
      images: ['https://img/a.png', 'https://img/b.png'],
      tags: ['angular', 'firebase'],
      link: 'https://demo',
      github: 'https://github.com/me/site',
      order: 2,
    })

    expect(plan.changed).toBe(true)
    expect(plan.set).toMatchObject({
      title: 'Portfolio Site',
      slug: 'portfolio-site',
      excerpt: 'My personal site',
      coverImage: 'https://img/a.png',
      tags: ['angular', 'firebase'],
      technologies: [],
      sourceCodeLink: 'https://github.com/me/site',
      livePreviewLink: 'https://demo',
      content: null,
      developmentStatus: null,
      status: 'published',
      visibility: 'public',
    })
    expect([...plan.remove].sort()).toEqual(
      ['description', 'github', 'images', 'link', 'name', 'order'].sort()
    )
    expect(plan.warnings[0]).toContain('images')
  })

  it('is idempotent — a document already on the new shape is unchanged', () => {
    const plan = planProjectMigration({
      title: 'Already migrated',
      slug: 'already-migrated',
      status: 'published',
    })

    expect(plan.changed).toBe(false)
    expect(plan.set).toEqual({})
    expect(plan.remove).toEqual([])
  })

  it('defaults missing optional fields and warns only about extra images', () => {
    const plan = planProjectMigration({ name: 'Bare', description: 'x', order: 0 })

    expect(plan.set).toMatchObject({
      coverImage: null,
      sourceCodeLink: null,
      livePreviewLink: null,
      tags: [],
    })
    expect(plan.warnings).toEqual([])
  })
})
