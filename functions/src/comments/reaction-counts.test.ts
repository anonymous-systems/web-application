import { countDelta } from './reaction-counts'

describe('countDelta', () => {
  it('increments on a new reaction', () => {
    expect(countDelta(null, 'like')).toEqual({ likeCount: 1 })
    expect(countDelta(null, 'dislike')).toEqual({ dislikeCount: 1 })
  })

  it('decrements when a reaction is withdrawn', () => {
    expect(countDelta('like', null)).toEqual({ likeCount: -1 })
    expect(countDelta('dislike', null)).toEqual({ dislikeCount: -1 })
  })

  // Switching sides has to move both counters, or the old one is left inflated.
  it('moves both counters when a reaction is switched', () => {
    expect(countDelta('like', 'dislike')).toEqual({
      likeCount: -1,
      dislikeCount: 1,
    })
    expect(countDelta('dislike', 'like')).toEqual({
      dislikeCount: -1,
      likeCount: 1,
    })
  })

  // Firestore triggers can fire more than once for the same write, so an
  // unchanged transition must be a no-op rather than double-counting.
  it('is a no-op when nothing changed', () => {
    expect(countDelta('like', 'like')).toEqual({})
    expect(countDelta(null, null)).toEqual({})
  })

  it('ignores an unrecognised reaction type', () => {
    expect(countDelta(null, 'shrug')).toEqual({})
    expect(countDelta('shrug', 'like')).toEqual({ likeCount: 1 })
  })
})
