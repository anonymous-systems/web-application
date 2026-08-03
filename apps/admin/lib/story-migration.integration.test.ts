// @vitest-environment node
import { afterAll, describe, expect, it } from 'vitest'
import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { applyStoryMigrations } from './apply-story-migrations'

// Opt-in: this test needs a running Firestore emulator, so it's gated on an
// explicit flag (FIRESTORE_EMULATOR_HOST alone is set by .env.local even when no
// emulator is up). Run it with the emulator via:
//   RUN_INTEGRATION=1 pnpm --filter admin test   (with the emulator running)
// A plain `nx test admin` skips it.
const runIntegration = process.env.RUN_INTEGRATION === '1'

describe.skipIf(!runIntegration)('applyStoryMigrations (emulator)', () => {
  const app =
    getApps()[0] ??
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID ?? 'anonymous-systems-dev',
    })
  const db = getFirestore(app)
  const ref = db.collection('stories').doc('legacyIntegration')

  afterAll(async () => {
    await ref.delete()
  })

  it('converts a legacy-shape story to the current model, idempotently', async () => {
    await ref.set({
      title: 'Legacy',
      slug: 'legacy',
      type: 'article',
      status: 'published',
      visibility: 'public',
      byline: 'Old summary',
      image: 'http://example/cover.png',
      categories: ['react', 'firebase'],
      readTime: 5,
      author: { name: 'Aaron', image: null },
      created: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    })

    const result = await applyStoryMigrations(db)
    expect(result.migrated).toBeGreaterThanOrEqual(1)

    const after = (await ref.get()).data() ?? {}
    expect(after.excerpt).toBe('Old summary')
    expect(after.coverImage).toBe('http://example/cover.png')
    expect(after.category).toBe('react')
    expect(after.readTimeMinutes).toBe(5)
    expect(after.createdAt).toBeDefined()
    expect(after.byline).toBeUndefined()
    expect(after.image).toBeUndefined()
    expect(after.categories).toBeUndefined()
    expect(after.author).toBeUndefined()
    expect(after.created).toBeUndefined()

    // Re-running leaves the already-migrated document untouched.
    await applyStoryMigrations(db)
    const again = (await ref.get()).data() ?? {}
    expect(again.excerpt).toBe('Old summary')
    expect(again.byline).toBeUndefined()
  })
})
