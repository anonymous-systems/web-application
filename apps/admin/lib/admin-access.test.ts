import { describe, expect, it } from 'vitest'
import { hasAdminClaim } from './admin-access'

describe('hasAdminClaim', () => {
  it('grants access when the admin claim is exactly true', () => {
    expect(hasAdminClaim({ admin: true })).toBe(true)
  })

  it('denies access when the admin claim is false', () => {
    expect(hasAdminClaim({ admin: false })).toBe(false)
  })

  it('denies access when the admin claim is missing', () => {
    expect(hasAdminClaim({ creator: true })).toBe(false)
  })

  it('denies access for a truthy but non-boolean admin claim', () => {
    expect(hasAdminClaim({ admin: 'true' })).toBe(false)
  })

  it('denies access when there are no claims', () => {
    expect(hasAdminClaim(null)).toBe(false)
    expect(hasAdminClaim(undefined)).toBe(false)
  })
})
