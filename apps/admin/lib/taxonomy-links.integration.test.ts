// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getApps, initializeApp } from 'firebase-admin/app'
import { DocumentReference, getFirestore } from 'firebase-admin/firestore'
import { applyTaxonomyLinks } from './apply-taxonomy-links'

// Opt-in: needs a running Firestore emulator, so it's gated on an explicit flag
// (FIRESTORE_EMULATOR_HOST alone is set by .env.local even when no emulator is
// up). Run it with the emulator via:
//   RUN_INTEGRATION=1 pnpm --filter admin test
const runIntegration = process.env.RUN_INTEGRATION === '1'

describe.skipIf(!runIntegration)('applyTaxonomyLinks (emulator)', () => {
  const projectId = process.env.FIREBASE_PROJECT_ID ?? 'anonymous-systems-dev'
  const db = getFirestore(getApps()[0] ?? initializeApp({ projectId }))

  const story = db.collection('stories').doc('linkIntegrationStory')
  const project = db.collection('projects').doc('linkIntegrationProject')
  const tag = db.collection('tags').doc('link-integration-angular')
  const category = db.collection('categories').doc('link-integration-web')

  const created: DocumentReference[] = []

  beforeAll(async () => {
    await tag.set({
      name: 'Link Integration Angular',
      slug: 'link-integration-angular',
    })
    await category.set({ name: 'Link Integration Web', slug: 'link-integration-web' })
    // The two real shapes in dev: stories hold slugs, projects hold display
    // names, and some names have no term behind them at all.
    await story.set({
      title: 'Linked story',
      category: 'link-integration-web',
      tags: ['link-integration-angular'],
    })
    await project.set({
      title: 'Linked project',
      category: null,
      tags: ['Link Integration Angular', 'Link Integration Ghost'],
      technologies: [],
    })
  })

  afterAll(async () => {
    await Promise.all(
      [story, project, tag, category, ...created].map((ref) => ref.delete())
    )
  })

  it('rewrites both shapes as references and creates the terms behind them', async () => {
    const result = await applyTaxonomyLinks(db)

    expect(result.warnings).toEqual([])
    expect(result.created).toContainEqual({
      collection: 'tags',
      slug: 'link-integration-ghost',
      name: 'Link Integration Ghost',
    })

    for (const term of result.created) {
      const docs = (
        await db.collection(term.collection).where('slug', '==', term.slug).get()
      ).docs
      docs.forEach((doc) => created.push(doc.ref))
    }

    const ghost = created.find((ref) => ref.parent.id === 'tags')
    expect(ghost).toBeDefined()

    const storyData = (await story.get()).data() ?? {}
    expect((storyData.category as DocumentReference).path).toBe(category.path)
    expect((storyData.tags as DocumentReference[]).map((ref) => ref.path)).toEqual([
      tag.path,
    ])

    // The tag stored as a display name resolves to the same term the story
    // reached by slug — one term, not two.
    const projectData = (await project.get()).data() ?? {}
    expect(
      (projectData.tags as DocumentReference[]).map((ref) => ref.path)
    ).toEqual([tag.path, ghost?.path])
    expect(projectData.technologies).toEqual([])
  })

  it('is a no-op once the links are references', async () => {
    const result = await applyTaxonomyLinks(db)

    expect(result.migrated).toBe(0)
    expect(result.created).toEqual([])
  })
})
