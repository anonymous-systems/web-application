import { describe, expect, it } from 'vitest'
import { slugify } from '@workspace/ui/lib/slug'
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  validateTaxonomyInput,
} from './taxonomy'

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

describe('validateTaxonomyInput', () => {
  it('accepts a valid term', () => {
    expect(validateTaxonomyInput({ name: 'Web Development' }).valid).toBe(true)
  })

  it('accepts a valid description', () => {
    const result = validateTaxonomyInput({ name: 'Design', description: 'UI work' })
    expect(result.valid).toBe(true)
  })

  it('rejects an empty or whitespace-only name', () => {
    expect(validateTaxonomyInput({ name: '' }).valid).toBe(false)
    expect(validateTaxonomyInput({ name: '   ' }).error).toContain('required')
  })

  it('rejects a name that is too long', () => {
    const result = validateTaxonomyInput({ name: 'a'.repeat(MAX_NAME_LENGTH + 1) })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('60')
  })

  it('rejects a name with no letters or numbers', () => {
    const result = validateTaxonomyInput({ name: '!!!' })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('at least one')
  })

  it('rejects a description that is too long', () => {
    const result = validateTaxonomyInput({
      name: 'Design',
      description: 'a'.repeat(MAX_DESCRIPTION_LENGTH + 1),
    })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Description')
  })
})
