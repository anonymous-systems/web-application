import { describe, expect, it } from 'vitest'
import { isActiveNavItem } from './dashboard-nav'

describe('isActiveNavItem', () => {
  it('marks the overview active only on the exact root path', () => {
    expect(isActiveNavItem('/', '/')).toBe(true)
    expect(isActiveNavItem('/categories', '/')).toBe(false)
  })

  it('marks a section active on its exact path', () => {
    expect(isActiveNavItem('/categories', '/categories')).toBe(true)
  })

  it('marks a section active on a child path', () => {
    expect(isActiveNavItem('/categories/new', '/categories')).toBe(true)
  })

  it('does not match a different section', () => {
    expect(isActiveNavItem('/tags', '/categories')).toBe(false)
  })

  it('does not match a prefix collision', () => {
    expect(isActiveNavItem('/categories-archive', '/categories')).toBe(false)
  })
})
