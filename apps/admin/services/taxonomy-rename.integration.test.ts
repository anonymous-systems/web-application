// @vitest-environment node
import { afterAll, describe, expect, it } from 'vitest'
import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { createTerm, listTerms, updateTerm } from './taxonomy-service'
import { createStory, getStory } from './story-service'

// Opt-in: needs a running Firestore emulator, so it's gated on an explicit flag
// (FIRESTORE_EMULATOR_HOST alone is set by .env.local even when no emulator is
// up). Run it with the emulator via:
//   RUN_INTEGRATION=1 pnpm --filter admin test
const runIntegration = process.env.RUN_INTEGRATION === '1'

/**
 * The bug this whole change exists to fix: a story linked to a tag by the tag's
 * slug, and renaming the tag re-derived that slug — so the story pointed at a
 * slug nothing answered to and the tag silently vanished from the page.
 */
describe.skipIf(!runIntegration)('renaming a taxonomy term (emulator)', () => {
  const projectId = process.env.FIREBASE_PROJECT_ID ?? 'anonymous-systems-dev'
  // `db()` reuses an existing app, so initialising here points the services at
  // the emulator without them needing to know they are under test.
  const db = getFirestore(getApps()[0] ?? initializeApp({ projectId }))

  const ORIGINAL = 'Rename Regression'
  const RENAMED = 'Renamed Regression'
  let tagId = ''
  let storyId = ''

  const tag = async (): Promise<{ id: string; name: string; slug: string }> => {
    const found = (await listTerms('tags')).find(
      (term) => term.id === tagId || term.name === ORIGINAL
    )
    if (!found) throw new Error('tag not found')

    return found
  }

  afterAll(async () => {
    if (storyId) await db.collection('stories').doc(storyId).delete()
    if (tagId) await db.collection('tags').doc(tagId).delete()
  })

  it('keeps the content linked, and the slug stable', async () => {
    expect((await createTerm('tags', ORIGINAL, '')).ok).toBe(true)
    const created = await tag()
    tagId = created.id
    const originalSlug = created.slug

    const story = await createStory(
      {
        title: 'Rename regression story',
        type: 'article',
        status: 'draft',
        visibility: 'public',
        excerpt: null,
        content: null,
        coverImage: null,
        category: null,
        tags: [tagId],
        allowComments: true,
        featured: false,
        problemStatus: null,
      },
      'integrationOwner'
    )
    expect(story.ok).toBe(true)
    storyId = story.id ?? ''

    expect((await updateTerm('tags', tagId, RENAMED, '')).ok).toBe(true)

    // The slug is the term's public identity, so a rename must not move it.
    expect((await tag()).slug).toBe(originalSlug)

    // The link survives the rename and now reads the new name.
    expect((await getStory(storyId))?.tags).toEqual([
      { id: tagId, name: RENAMED, slug: originalSlug },
    ])
  })
})
