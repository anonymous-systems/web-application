import { describe, expect, it, vi } from 'vitest'
import type { Firestore } from 'firebase/firestore'

// Stubbed so the constraints can be inspected without a live Firestore. The
// query must match publicStory()/publicProject() in firestore.rules exactly:
// rules authorise rather than filter, so asking for more than they allow fails
// the whole query instead of trimming the result.
vi.mock('firebase/firestore', () => ({
  collection: (_firestore: unknown, path: string) => ({ path }),
  where: (field: string, op: string, value: unknown) => ({ field, op, value }),
  query: (ref: unknown, ...constraints: unknown[]) => ({ ref, constraints }),
}))

const { byNewest, publiclyVisible } = await import('./public-content')

describe('publiclyVisible', () => {
  it.each(['stories', 'projects'] as const)(
    'restricts %s to published, public documents',
    (path) => {
      const built = publiclyVisible({} as Firestore, path) as unknown as {
        ref: { path: string }
        constraints: { field: string; op: string; value: unknown }[]
      }

      expect(built.ref.path).toBe(path)
      expect(built.constraints).toEqual([
        { field: 'status', op: '==', value: 'published' },
        { field: 'visibility', op: '==', value: 'public' },
      ])
    }
  )
})

describe('byNewest', () => {
  const at = (
    publishedAt: string | null,
    createdAt: string | null = null
  ): { publishedAt: string | null; createdAt: string | null } => ({
    publishedAt,
    createdAt,
  })

  it('sorts newest first by published date', () => {
    const sorted = [
      at('2024-01-01T00:00:00.000Z'),
      at('2026-01-01T00:00:00.000Z'),
      at('2025-01-01T00:00:00.000Z'),
    ].sort(byNewest)

    expect(sorted.map((item) => item.publishedAt)).toEqual([
      '2026-01-01T00:00:00.000Z',
      '2025-01-01T00:00:00.000Z',
      '2024-01-01T00:00:00.000Z',
    ])
  })

  it('falls back to created date when a document has never been published', () => {
    // Migrated stories can lack publishedAt entirely.
    const sorted = [
      at(null, '2024-01-01T00:00:00.000Z'),
      at(null, '2026-01-01T00:00:00.000Z'),
    ].sort(byNewest)

    expect(sorted.map((item) => item.createdAt)).toEqual([
      '2026-01-01T00:00:00.000Z',
      '2024-01-01T00:00:00.000Z',
    ])
  })

  it('sorts documents with no dates last', () => {
    const dated = at('2025-01-01T00:00:00.000Z')
    const undatedFirst = [at(null), dated].sort(byNewest)

    expect(undatedFirst[0]).toBe(dated)
  })
})
