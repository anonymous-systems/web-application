import { describe, expect, it } from 'vitest'
import { initialsFrom } from './initials'

describe('initialsFrom', () => {
  it('takes up to two initials from a display name', () => {
    expect(initialsFrom('Ada Lovelace')).toBe('AL')
    expect(initialsFrom('Ada Byron Lovelace')).toBe('AB')
  })

  it('uppercases a single name', () => {
    expect(initialsFrom('ada')).toBe('A')
  })

  it('is blank for an unknown author, so no stray letter renders', () => {
    expect(initialsFrom(null)).toBe('')
    expect(initialsFrom(undefined)).toBe('')
    expect(initialsFrom('')).toBe('')
  })
})
