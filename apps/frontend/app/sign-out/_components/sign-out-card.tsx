'use client'

import { JSX, useEffect, useState } from 'react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/app-routes'
import { Logo } from '@/components/logo'
import { Button } from '@workspace/ui/components/button'
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
  }, []) // only run on mount

  const getSignOutMessage = (isLoading: boolean, isSignedOut: boolean): string => {
    if (isLoading) return 'Signing Out...'
    if (isSignedOut) return 'You have been signed out successfully.'
    return 'Sign out failed. Please try again.'
  }

  return (
    <div
      className={[
        'flex flex-col gap-4 bg-card',
        'text-card-foreground rounded-lg',
        'outline p-8 max-w-[400px] shadow-sm'
      ].join(' ')}
    >
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
    </div>
  )
}