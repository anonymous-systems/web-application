'use client'

import { JSX, useEffect, useState } from 'react'
import { AuthCardShell } from '@workspace/ui/components/auth-card-shell'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BrandName } from '@workspace/ui/components/brand-name'
import { Button } from '@workspace/ui/components/custom/button'
import { signOut } from '@/services/auth-service'
import { AppRoutes } from '@/lib/app-routes'

const getSignOutMessage = (isLoading: boolean, isSignedOut: boolean): string => {
  if (isLoading) return 'Signing out...'
  if (isSignedOut) return 'You have been signed out.'
  return 'Sign out failed. Please try again.'
}

export const AdminSignOutCard = (): JSX.Element => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSignedOut, setIsSignedOut] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    signOut()
      .then((success) => {
        setIsSignedOut(success)
        router.refresh()
      })
      .catch(() => setIsSignedOut(false))
      .finally(() => setIsLoading(false))
    // Signing out is a one-shot action on arrival, not a reaction to a
    // changing value — re-running it on every render would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthCardShell dataTestId='adminSignOutCard'>
      <BrandName className='text-center' />
      <div className='flex flex-col gap-2 text-center'>
        <h3 className='text-3xl'>{getSignOutMessage(isLoading, isSignedOut)}</h3>
        <p className='text-sm text-muted-foreground'>
          Thanks for keeping Anonymous Systems running.
        </p>
      </div>
      <Link href={AppRoutes.signIn}>
        <Button className='w-full' data-testid='signInButton'>
          Sign in again
        </Button>
      </Link>
    </AuthCardShell>
  )
}
