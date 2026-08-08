import { describe, expect, it } from 'vitest'
import { countReactions, planCountRepair } from './reaction-count-repair'

describe('countReactions', () => {
  it('counts each side', () => {
    expect(
      countReactions([{ type: 'like' }, { type: 'dislike' }, { type: 'like' }])
    ).toEqual({ likeCount: 2, dislikeCount: 1 })
  })

  it('is zero for no reactions', () => {
    expect(countReactions([])).toEqual({ likeCount: 0, dislikeCount: 0 })
  })

  // The rules only permit like and dislike, so anything else is corrupt and is
  // dropped rather than guessed at.
  it('ignores an unrecognised type', () => {
    expect(
      countReactions([{ type: 'like' }, { type: 'shrug' }, { type: undefined }])
    ).toEqual({ likeCount: 1, dislikeCount: 0 })
  })
})

describe('planCountRepair', () => {
  /*
   * The state found in dev. The like was created while the counter trigger was
   * undeployed, so it was never incremented; switching it to a dislike then
   * applied the -1 anyway, leaving a negative total against a single reaction.
   */
  it('repairs a count driven negative by a missed increment', () => {
    const repair = planCountRepair({ likeCount: -1, dislikeCount: 1 }, [
      { type: 'dislike' },
    ])

    expect(repair.changed).toBe(true)
    expect(repair.stored).toEqual({ likeCount: -1, dislikeCount: 1 })
    expect(repair.actual).toEqual({ likeCount: 0, dislikeCount: 1 })
  })

  it('leaves totals that already agree', () => {
    const repair = planCountRepair({ likeCount: 1, dislikeCount: 0 }, [
      { type: 'like' },
    ])

    expect(repair.changed).toBe(false)
  })

  // Comments predating reactions carry neither field.
  it('treats absent totals as zero', () => {
    expect(planCountRepair({}, []).changed).toBe(false)
    expect(planCountRepair({}, [{ type: 'like' }]).changed).toBe(true)
  })

  // Deleting a comment does not delete its reactions, and deleting a reaction
  // document directly bypasses nothing — either way the total is left high.
  it('repairs a count left too high', () => {
    const repair = planCountRepair({ likeCount: 5, dislikeCount: 0 }, [])

    expect(repair.changed).toBe(true)
    expect(repair.actual).toEqual({ likeCount: 0, dislikeCount: 0 })
  })
})
