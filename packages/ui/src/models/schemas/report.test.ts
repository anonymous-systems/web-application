import { describe, expect, it } from 'vitest'
import { REPORT_DETAIL_MAX, reportInputSchema } from './report'

describe('reportInputSchema', () => {
  it('accepts a named reason with no detail', () => {
    expect(reportInputSchema.safeParse({ reason: 'spam' }).success).toBe(true)
  })

  it('trims surrounding whitespace from the detail', () => {
    expect(
      reportInputSchema.parse({ reason: 'spam', detail: '  bot links  ' })
    ).toEqual({ reason: 'spam', detail: 'bot links' })
  })

  it('rejects detail past the maximum length', () => {
    const detail = 'a'.repeat(REPORT_DETAIL_MAX + 1)

    expect(reportInputSchema.safeParse({ reason: 'spam', detail }).success).toBe(
      false
    )
  })

  describe('"other"', () => {
    // "Something else" names nothing on its own, so the detail carries the whole
    // report. Trimming runs first, which is why whitespace does not satisfy it.
    it.each([undefined, '', '   ', '\n\t'])(
      'requires a detail (%j)',
      (detail) => {
        const result = reportInputSchema.safeParse({ reason: 'other', detail })

        expect(result.success).toBe(false)
        expect(result.error?.issues[0]?.path).toEqual(['detail'])
      }
    )

    it('accepts a detail', () => {
      expect(
        reportInputSchema.safeParse({
          reason: 'other',
          detail: 'Impersonating someone',
        }).success
      ).toBe(true)
    })
  })
})
