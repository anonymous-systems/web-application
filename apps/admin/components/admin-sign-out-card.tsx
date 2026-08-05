'use client'

import { JSX, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BrandName } from '@workspace/ui/components/brand-name'
import { Button } from '@workspace/ui/components/custom/button'
import { signOut } from '@/services/auth-service'
import { AppRoutes } from '@/lib/app-routes'

const cardClassName = [
  'flex flex-col gap-4 bg-card',
  'text-card-foreground rounded-lg',
  'outline p-8 max-w-[400px] shadow-sm'
].join(' ')

const getSignOutMessage = (isLoading: boolean, isSignedOut: boolean): string => {
  if (isLoading) return 'Signing out...'
  if (isSignedOut) return 'You have been signed out.'
  return 'Sign out failed. Please try again.'
}

export const AdminSignOutCard = (): JSX.Element => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSignedOut, setIsSignedOut] = useState(false)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setIsLoading(true)
    signOut()
      .then((success) => {
        setIsSignedOut(success)
        router.refresh()
      })
      .catch(() => setIsSignedOut(false))
      .finally(() => setIsLoading(false))
  }, []) // only run on mount
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className={cardClassName} data-testid='adminSignOutCard'>
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
    </div>
  )
}
