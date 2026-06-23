import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('@/services/auth-service', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

import { signIn, signOut } from '@/services/auth-service'
import { useAuthService } from './use-auth-service'

describe('useAuthService', () => {
  it('exposes the signIn and signOut functions from the auth service', () => {
    const { result } = renderHook(() => useAuthService())

    expect(result.current.signIn).toBe(signIn)
    expect(result.current.signOut).toBe(signOut)
  })
})
