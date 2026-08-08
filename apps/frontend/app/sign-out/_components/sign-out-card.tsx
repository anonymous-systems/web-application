'use client'

import { JSX, useEffect, useState } from 'react'
import { AuthCardShell } from '@workspace/ui/components/auth-card-shell'
import Link from 'next/link'
import { AppRoutes } from '@/lib/app-routes'
import { Logo } from '@/components/logo'
import { Button } from '@workspace/ui/components/custom/button'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

export const SignOutCard = (): JSX.Element => {
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSignedOut, setIsSignedOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoading(true)
    signOut()
      .then(() => {
        setIsSignedOut(true)
        router.refresh()
      })
      .catch(() => setIsSignedOut(false))
      .finally(() => setIsLoading(false))
    // Signing out is a one-shot action on arrival, not a reaction to a
    // changing value — re-running it on every render would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSignOutMessage = (isLoading: boolean, isSignedOut: boolean): string => {
    if (isLoading) return 'Signing Out...'
    if (isSignedOut) return 'You have been signed out successfully.'
    return 'Sign out failed. Please try again.'
  }

  return (
    <AuthCardShell>
      <picture className='flex justify-center'>
        <Link href={AppRoutes.home}>
          <Logo />
        </Link>
      </picture>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2 text-center'>
          <h3 className='text-3xl'>
            {getSignOutMessage(isLoading, isSignedOut)}
          </h3>
          <p className='text-sm text-muted-foreground'>
            Thank you for using our service. We hope to see you again soon!
          </p>
        </div>
        <Link href={AppRoutes.signIn}>
          <Button
            className='w-full'
            data-testid='signInButton'
          >
            Sign In Again
          </Button>
        </Link>
      </div>
    </AuthCardShell>
  )
}