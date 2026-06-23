import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { AuthContext, AuthContextValue } from '@/contexts/auth-context'
import { useAuthContext } from './use-auth-context'

describe('useAuthContext', () => {
  it('returns the default value when there is no provider', () => {
    const { result } = renderHook(() => useAuthContext())

    expect(result.current).toEqual({
      user: null,
      clientUser: null,
      isLoadingClientUser: false,
    })
  })

  it('returns the value supplied by AuthContext.Provider', () => {
    const value: AuthContextValue = {
      user: null,
      clientUser: null,
      isLoadingClientUser: true,
    }

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      ),
    })

    expect(result.current).toBe(value)
  })
})
