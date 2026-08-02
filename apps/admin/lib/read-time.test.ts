import { describe, expect, it } from 'vitest'
import { readTimeMinutes } from './read-time'

describe('readTimeMinutes', () => {
  it('is 0 for empty or tag-only content', () => {
    expect(readTimeMinutes(null)).toBe(0)
    expect(readTimeMinutes('')).toBe(0)
    expect(readTimeMinutes('<p></p>')).toBe(0)
  })

  it('rounds up to at least a minute for short content', () => {
    expect(readTimeMinutes('<p>Just a few words here.</p>')).toBe(1)
  })

  it('scales with word count at ~200 wpm', () => {
    const content = `<p>${Array.from({ length: 450 }, () => 'word').join(' ')}</p>`
    expect(readTimeMinutes(content)).toBe(3)
  })
})
