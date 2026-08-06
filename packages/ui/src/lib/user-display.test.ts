import { describe, expect, it } from 'vitest'
import { resolveAuthorName } from './user-display'

describe('resolveAuthorName', () => {
  it('joins first and last name', () => {
    expect(resolveAuthorName({ firstName: 'Ada', lastName: 'Lovelace' })).toBe('Ada Lovelace')
  })

  it('uses whichever name part is present', () => {
    expect(resolveAuthorName({ firstName: 'Ada' })).toBe('Ada')
  })

  it('is null when the profile is missing or has no name', () => {
    expect(resolveAuthorName(undefined)).toBeNull()
    expect(resolveAuthorName({ username: 'ada' })).toBeNull()
  })
})
