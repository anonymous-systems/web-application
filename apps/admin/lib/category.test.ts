import { describe, expect, it } from 'vitest'
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  slugify,
  validateCategoryInput,
} from './category'

describe('slugify', () => {
  it('lowercases and hyphenates words', () => {
    expect(slugify('Web Development')).toBe('web-development')
  })

  it('collapses punctuation and repeated separators', () => {
    expect(slugify('Cloud  &  DevOps!')).toBe('cloud-devops')
  })

  it('trims leading and trailing separators', () => {
    expect(slugify('  --Design--  ')).toBe('design')
  })

  it('returns an empty string when there is nothing sluggable', () => {
    expect(slugify('!!!')).toBe('')
  })
})

describe('validateCategoryInput', () => {
  it('accepts a valid category', () => {
    expect(validateCategoryInput({ name: 'Web Development' }).valid).toBe(true)
  })

  it('accepts a valid description', () => {
    const result = validateCategoryInput({ name: 'Design', description: 'UI work' })
    expect(result.valid).toBe(true)
  })

  it('rejects an empty or whitespace-only name', () => {
    expect(validateCategoryInput({ name: '' }).valid).toBe(false)
    expect(validateCategoryInput({ name: '   ' }).error).toContain('required')
  })

  it('rejects a name that is too long', () => {
    const result = validateCategoryInput({ name: 'a'.repeat(MAX_NAME_LENGTH + 1) })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('60')
  })

  it('rejects a name with no letters or numbers', () => {
    const result = validateCategoryInput({ name: '!!!' })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('at least one')
  })

  it('rejects a description that is too long', () => {
    const result = validateCategoryInput({
      name: 'Design',
      description: 'a'.repeat(MAX_DESCRIPTION_LENGTH + 1),
    })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Description')
  })
})
