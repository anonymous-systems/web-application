import { useRouter, useSearchParams } from 'next/navigation'

interface AuthNavigation {
  redirectAfterSignIn: () => void
}

export const useAuthNavigation = (): AuthNavigation => {
  const router = useRouter()
  const params = useSearchParams()

  const redirectAfterSignIn = (): void => {
    const redirectPath = params.get('redirect')
    if (redirectPath != null) router.push(redirectPath)

    router.refresh()
  }

  return { redirectAfterSignIn }
}
