import { describe, expect, it } from 'vitest'
import { COMMENT_CONTENT_MAX, commentInputSchema } from './comment'

describe('commentInputSchema', () => {
  it('trims surrounding whitespace', () => {
    expect(commentInputSchema.parse({ content: '  Nice write-up  ' })).toEqual({
      content: 'Nice write-up',
    })
  })

  // Trimming happens before the length check, so whitespace alone is empty.
  it.each(['', '   ', '\n\t'])('rejects blank content (%j)', (content) => {
    expect(commentInputSchema.safeParse({ content }).success).toBe(false)
  })

  it('accepts content at the maximum length', () => {
    const content = 'a'.repeat(COMMENT_CONTENT_MAX)

    expect(commentInputSchema.safeParse({ content }).success).toBe(true)
  })

  it('rejects content past the maximum length', () => {
    const content = 'a'.repeat(COMMENT_CONTENT_MAX + 1)

    expect(commentInputSchema.safeParse({ content }).success).toBe(false)
  })

  // The author and timestamp are owned by the writer; the rules require the
  // stored `user` to match the caller, so accepting either here is unsafe.
  it('drops anything beyond content', () => {
    const parsed = commentInputSchema.parse({
      content: 'Nice',
      user: 'users/someone-else',
      createdAt: new Date(0),
    } as never)

    expect(parsed).toEqual({ content: 'Nice' })
  })
})
