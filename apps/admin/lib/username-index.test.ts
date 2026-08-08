import { describe, expect, it } from 'vitest'
import { planIndexEntry } from './username-index'

describe('planIndexEntry', () => {
  /*
   * The state found in dev: a real account with a username and an entirely
   * empty index, because the account predates the onboarding function that
   * writes it. Its public profile answered 404.
   */
  it('creates the missing entry for an unindexed user', () => {
    const plan = planIndexEntry(
      { uid: 'tK9uZ', username: 'anonymousone' },
      new Map()
    )

    expect(plan).toEqual({
      action: 'create',
      username: 'anonymousone',
      userId: 'tK9uZ',
    })
  })

  it('skips a user already pointed at by the index', () => {
    const plan = planIndexEntry(
      { uid: 'tK9uZ', username: 'anonymousone' },
      new Map([['anonymousone', 'tK9uZ']])
    )

    expect(plan?.action).toBe('skip')
  })

  // Reassigning would move a public profile URL from one person to another, so
  // it is reported for a human rather than resolved.
  it('reports a username held by someone else instead of taking it', () => {
    const plan = planIndexEntry(
      { uid: 'newcomer', username: 'anonymousone' },
      new Map([['anonymousone', 'tK9uZ']])
    )

    expect(plan).toEqual({
      action: 'conflict',
      username: 'anonymousone',
      userId: 'newcomer',
      heldBy: 'tK9uZ',
    })
  })

  // Two of the three dev users are in this state — signed in, never onboarded.
  it.each([undefined, '', '   ', 42, null])(
    'ignores a user with no usable username (%j)',
    (username) => {
      expect(planIndexEntry({ uid: 'u', username }, new Map())).toBeNull()
    }
  )
})
