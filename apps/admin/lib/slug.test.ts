// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { slugify, uniqueSlug } from '@workspace/ui/lib/slug'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('  Hello, World!  ')).toBe('hello-world')
  })

  it('is empty when there is nothing to slug', () => {
    expect(slugify('!!!')).toBe('')
  })
})

describe('uniqueSlug', () => {
  it('uses the plain slug when nothing has claimed it', () => {
    expect(uniqueSlug('My Story', [])).toBe('my-story')
    expect(uniqueSlug('My Story', ['other-story'])).toBe('my-story')
  })

  it('suffixes a taken slug', () => {
    expect(uniqueSlug('My Story', ['my-story'])).toBe('my-story-2')
  })

  it('walks past every taken suffix', () => {
    expect(uniqueSlug('My Story', ['my-story', 'my-story-2', 'my-story-3'])).toBe(
      'my-story-4'
    )
  })

  it('fills a gap left by a deleted document', () => {
    expect(uniqueSlug('My Story', ['my-story', 'my-story-3'])).toBe('my-story-2')
  })

  it('keeps its own slug on update, since the caller excludes it from taken', () => {
    expect(uniqueSlug('My Story', ['my-story-2'])).toBe('my-story')
  })

  it('leaves an unslugifiable title empty for the caller to reject', () => {
    expect(uniqueSlug('!!!', ['x'])).toBe('')
  })
})
