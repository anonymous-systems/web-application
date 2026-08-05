import { describe, expect, it } from 'vitest'
import { canManageAdminAccess, hasAdminClaim } from './admin-access'

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

describe('canManageAdminAccess', () => {
  it('allows an admin to manage another user', () => {
    const decision = canManageAdminAccess({ uid: 'admin-1', isAdmin: true }, 'user-2')
    expect(decision.allowed).toBe(true)
  })

  it('denies a non-admin caller', () => {
    const decision = canManageAdminAccess({ uid: 'user-1', isAdmin: false }, 'user-2')
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toContain('admin')
  })

  it('denies changing your own admin access', () => {
    const decision = canManageAdminAccess({ uid: 'admin-1', isAdmin: true }, 'admin-1')
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toContain('your own')
  })
})
