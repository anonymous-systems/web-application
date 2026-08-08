import { describe, expect, it } from 'vitest'
import { displayedReactions, type ReactionSnapshot } from './reaction-display'

const fresh: ReactionSnapshot = {
  reaction: null,
  likeCount: 0,
  dislikeCount: 0,
}

describe('displayedReactions', () => {
  it('shows the server counts when the viewer has not reacted', () => {
    expect(
      displayedReactions({ reaction: null, likeCount: 3, dislikeCount: 1 }, null)
    ).toEqual({ likes: 3, dislikes: 1 })
  })

  it('adds the viewer’s new reaction', () => {
    expect(displayedReactions(fresh, 'dislike')).toEqual({ likes: 0, dislikes: 1 })
  })

  it('removes a withdrawn reaction', () => {
    expect(
      displayedReactions({ reaction: 'like', likeCount: 2, dislikeCount: 0 }, null)
    ).toEqual({ likes: 1, dislikes: 0 })
  })

  // The reported sequence: press dislike, then press like. Both counters have to
  // move — the dislike coming off as the like goes on.
  it('moves both counters when the viewer switches sides', () => {
    expect(
      displayedReactions({ reaction: 'dislike', likeCount: 0, dislikeCount: 1 }, 'like')
    ).toEqual({ likes: 1, dislikes: 0 })
  })

  /*
   * The bug this function exists to prevent. The trigger that maintains the
   * counts runs after the reaction is written, so a refresh issued on save can
   * return `reaction` already updated while the counts still lag. Passing that
   * half-updated document in as the snapshot yields no delta and the stale
   * count is displayed as though it were current.
   */
  it('is wrong if given a snapshot taken after the viewer reacted', () => {
    const stale: ReactionSnapshot = {
      reaction: 'like',
      likeCount: 0,
      dislikeCount: 0,
    }

    expect(displayedReactions(stale, 'like')).toEqual({ likes: 0, dislikes: 0 })
  })

  // A -1 can only apply where the snapshot counted this viewer, so the total
  // cannot be driven below zero and rendered as a negative chip.
  it('never goes negative', () => {
    const { likes, dislikes } = displayedReactions(
      { reaction: 'like', likeCount: 1, dislikeCount: 0 },
      'dislike'
    )

    expect(likes).toBe(0)
    expect(dislikes).toBe(1)
  })
})
