import { describe, expect, it, vi } from 'vitest'
import type { CollectionReference } from 'firebase-admin/firestore'
import { byNewest, publiclyVisible } from './public-content'

/** Records the `where` calls a query builder receives, chaining like Firestore. */
const fakeCollection = (): {
  collection: CollectionReference
  calls: [string, string, unknown][]
} => {
  const calls: [string, string, unknown][] = []
  const query = {
    where: vi.fn((field: string, op: string, value: unknown) => {
      calls.push([field, op, value])
      return query
    }),
  }

  return { collection: query as unknown as CollectionReference, calls }
}

describe('publiclyVisible', () => {
  it('restricts the query to published, public documents', () => {
    const { collection, calls } = fakeCollection()

    publiclyVisible(collection)

    expect(calls).toEqual([
      ['status', '==', 'published'],
      ['visibility', '==', 'public'],
    ])
  })
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
