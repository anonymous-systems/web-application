import { describe, expect, it } from 'vitest'
import { storyInputSchema } from './story'

describe('storyInputSchema', () => {
  it('accepts a minimal story and fills in defaults', () => {
    const result = storyInputSchema.parse({ title: 'My first story' })

    expect(result).toMatchObject({
      title: 'My first story',
      type: 'article',
      status: 'draft',
      visibility: 'public',
      tags: [],
      allowComments: true,
      featured: false,
    })
  })

  it('rejects a story with no title', () => {
    const result = storyInputSchema.safeParse({ title: '   ' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Title is required.')
  })

  it('rejects an unknown story type', () => {
    const result = storyInputSchema.safeParse({ title: 'x', type: 'novella' })

    expect(result.success).toBe(false)
  })

  it('rejects a problem status on a non-problem story', () => {
    const result = storyInputSchema.safeParse({
      title: 'x',
      type: 'article',
      problemStatus: 'open',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['problemStatus'])
  })

  it('allows a problem status on a problem story', () => {
    const result = storyInputSchema.safeParse({
      title: 'x',
      type: 'problem',
      problemStatus: 'resolved',
    })

    expect(result.success).toBe(true)
  })
})
