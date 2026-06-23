import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

const push = vi.fn()
const refresh = vi.fn()
let redirectParam: string | null = null

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
  useSearchParams: () => ({
    get: (key: string) => (key === 'redirect' ? redirectParam : null),
  }),
}))

import { useAuthNavigation } from './use-auth-navigation'

describe('useAuthNavigation', () => {
  beforeEach(() => {
    push.mockClear()
    refresh.mockClear()
    redirectParam = null
  })

  it('refreshes without redirecting when there is no redirect param', () => {
    const { result } = renderHook(() => useAuthNavigation())

    result.current.redirectAfterSignIn()

    expect(push).not.toHaveBeenCalled()
    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it('pushes to the redirect path and refreshes when one is present', () => {
    redirectParam = '/profile'
    const { result } = renderHook(() => useAuthNavigation())

    result.current.redirectAfterSignIn()

    expect(push).toHaveBeenCalledWith('/profile')
    expect(refresh).toHaveBeenCalledTimes(1)
  })
})
