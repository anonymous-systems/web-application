import { describe, expect, it } from 'vitest'
import { compareComments, type SortableComment } from './comment-sort'

interface Row extends SortableComment {
  id: string
}

const rows: Row[] = [
  { id: 'middle', createdAt: '2026-02-01T00:00:00.000Z', likeCount: 5 },
  { id: 'oldest', createdAt: '2026-01-01T00:00:00.000Z', likeCount: 2 },
  { id: 'newest', createdAt: '2026-03-01T00:00:00.000Z', likeCount: 0 },
]

const order = (sort: Parameters<typeof compareComments>[0]): string[] =>
  [...rows].sort(compareComments(sort)).map((row) => row.id)

describe('compareComments', () => {
  it('puts the first reply first for oldest', () => {
    expect(order('oldest')).toEqual(['oldest', 'middle', 'newest'])
  })

  it('reverses that for newest', () => {
    expect(order('newest')).toEqual(['newest', 'middle', 'oldest'])
  })

  it('ranks by likes for top', () => {
    expect(order('top')).toEqual(['middle', 'oldest', 'newest'])
  })

  // Most comments have no likes, so ties are the common case rather than an
  // edge one; without a second key their order would be whatever Firestore
  // happened to return.
  it('breaks ties in top by newest', () => {
    const tied: Row[] = [
      { id: 'a', createdAt: '2026-01-01T00:00:00.000Z', likeCount: 0 },
      { id: 'b', createdAt: '2026-03-01T00:00:00.000Z', likeCount: 0 },
      { id: 'c', createdAt: '2026-02-01T00:00:00.000Z', likeCount: 0 },
    ]

    expect([...tied].sort(compareComments('top')).map((row) => row.id)).toEqual([
      'b',
      'c',
      'a',
    ])
  })

  // A comment written before `createdAt` existed still has to appear.
  it('keeps an undated comment in the list', () => {
    const withUndated: Row[] = [
      ...rows,
      { id: 'undated', createdAt: null, likeCount: 0 },
    ]

    for (const sort of ['oldest', 'newest', 'top'] as const) {
      expect(
        [...withUndated].sort(compareComments(sort)).map((row) => row.id)
      ).toContain('undated')
    }
  })
})
