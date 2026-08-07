import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from './format-relative-time'

const NOW = new Date('2026-08-06T12:00:00.000Z')
const ago = (seconds: number): string =>
  new Date(NOW.getTime() - seconds * 1000).toISOString()

describe('formatRelativeTime', () => {
  it.each([
    [30, 'now'],
    [60 * 5, '5 minutes ago'],
    [60 * 60 * 3, '3 hours ago'],
    [60 * 60 * 24 * 2, '2 days ago'],
    [60 * 60 * 24 * 10, 'last week'],
    [60 * 60 * 24 * 60, '2 months ago'],
    [60 * 60 * 24 * 400, 'last year'],
  ])('renders %i seconds ago as %j', (seconds, expected) => {
    expect(formatRelativeTime(ago(seconds), NOW)).toBe(expected)
  })

  // A server timestamp can resolve a moment ahead of the reader's clock; saying
  // "in 2 seconds" on a comment you just posted reads as a bug.
  it('treats a slightly future timestamp as now', () => {
    const future = new Date(NOW.getTime() + 2000).toISOString()

    expect(formatRelativeTime(future, NOW)).toBe('now')
  })

  it('is null when the timestamp is missing', () => {
    expect(formatRelativeTime(null, NOW)).toBeNull()
  })

  it('is null when the timestamp is unparseable', () => {
    expect(formatRelativeTime('not-a-date', NOW)).toBeNull()
  })
})
