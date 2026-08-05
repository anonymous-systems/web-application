// @vitest-environment node
import { afterAll, describe, expect, it } from 'vitest'
import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { applyProjectMigrations } from './apply-project-migrations'

// Opt-in: this test needs a running Firestore emulator, so it's gated on an
// explicit flag (FIRESTORE_EMULATOR_HOST alone is set by .env.local even when no
// emulator is up). Run it with the emulator via:
//   RUN_INTEGRATION=1 pnpm --filter admin test   (with the emulator running)
// A plain `nx test admin` skips it.
const runIntegration = process.env.RUN_INTEGRATION === '1'

describe.skipIf(!runIntegration)('applyProjectMigrations (emulator)', () => {
  const app =
    getApps()[0] ??
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID ?? 'anonymous-systems-dev',
    })
  const db = getFirestore(app)
  const ref = db.collection('projects').doc('legacyIntegration')

  afterAll(async () => {
    await ref.delete()
  })

  it('converts a legacy-shape project to the current model, idempotently', async () => {
    await ref.set({
      name: 'Legacy Project',
      description: 'Old blurb',
      images: ['http://example/a.png', 'http://example/b.png'],
      tags: ['angular'],
      link: 'http://demo',
      github: 'http://github/me',
      order: 1,
    })

    const result = await applyProjectMigrations(db, { ownerUid: 'ownerUid123' })
    expect(result.migrated).toBeGreaterThanOrEqual(1)

    const after = (await ref.get()).data() ?? {}
    expect(after.title).toBe('Legacy Project')
    expect(after.slug).toBe('legacy-project')
    expect(after.excerpt).toBe('Old blurb')
    expect(after.coverImage).toBe('http://example/a.png')
    expect(after.sourceCodeLink).toBe('http://github/me')
    expect(after.livePreviewLink).toBe('http://demo')
    expect(after.status).toBe('published')
    expect(after.createdAt).toBeDefined()
    expect(after.name).toBeUndefined()
    expect(after.images).toBeUndefined()
    expect(after.link).toBeUndefined()
    expect(after.github).toBeUndefined()
    expect(after.order).toBeUndefined()

    // Re-running leaves the already-migrated document untouched.
    await applyProjectMigrations(db)
    const again = (await ref.get()).data() ?? {}
    expect(again.title).toBe('Legacy Project')
    expect(again.name).toBeUndefined()
  })
})
