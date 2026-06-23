import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('@/hooks/use-auth-context', () => ({
  useAuthContext: () => ({
    user: 'mock-user',
    clientUser: null,
    isLoadingClientUser: false,
  }),
}))
vi.mock('@/hooks/use-auth-service', () => ({
  useAuthService: () => ({
    signIn: 'mock-sign-in',
    signOut: 'mock-sign-out',
  }),
}))
vi.mock('@/hooks/use-auth-navigation', () => ({
  useAuthNavigation: () => ({ redirectAfterSignIn: 'mock-redirect' }),
}))

import { useAuth } from './use-auth'

describe('useAuth', () => {
  it('merges the context, service, and navigation hooks', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current).toEqual({
      user: 'mock-user',
      clientUser: null,
      isLoadingClientUser: false,
      signIn: 'mock-sign-in',
      signOut: 'mock-sign-out',
      redirectAfterSignIn: 'mock-redirect',
    })
  })
})
