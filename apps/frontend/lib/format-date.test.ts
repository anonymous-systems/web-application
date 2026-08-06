import { describe, expect, it } from 'vitest'
import { formatDate } from './format-date'

describe('formatDate', () => {
  it('renders an ISO timestamp as a short date', () => {
    expect(formatDate('2023-09-01T00:00:00.000Z')).toBe('Sep 1, 2023')
  })

  it('reads the timestamp as UTC, so the date never shifts by timezone', () => {
    expect(formatDate('2023-09-01T23:30:00.000Z')).toBe('Sep 1, 2023')
  })

  it('is null when the timestamp is missing', () => {
    // Migrated documents can lack publishedAt entirely.
    expect(formatDate(null)).toBeNull()
  })

  it('is null when the timestamp is unparseable', () => {
    expect(formatDate('not-a-date')).toBeNull()
  })
})
