'use client'

import { JSX, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2Icon } from 'lucide-react'
import { BrandName } from '@workspace/ui/components/brand-name'
import { Button } from '@workspace/ui/components/custom/button'
import { toast } from '@workspace/ui/components/sonner'
import { GoogleSuperGIcon } from '@workspace/ui/assets/icons/GoogleSuperGIcon'
import { signIn } from '@/services/auth-service'
import { AppRoutes } from '@/lib/app-routes'

interface AdminAuthCardProps {
  /** True when an authenticated user is signed in but lacks the admin claim. */
  unauthorized: boolean
}

const cardClassName = [
  'flex flex-col gap-4 bg-card',
  'text-card-foreground rounded-lg',
  'outline p-8 max-w-[400px] shadow-sm'
].join(' ')

export const AdminAuthCard = ({ unauthorized }: AdminAuthCardProps): JSX.Element => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (): Promise<void> => {
    setIsLoading(true)

    const success = await signIn()
    if (!success) {
      toast.error('Something went wrong while signing in. Please try again later.')
      setIsLoading(false)
      return
    }

    // the middleware admits the session only if it carries the admin claim
    router.push(AppRoutes.dashboard)
    router.refresh()
  }

  if (unauthorized) {
    return (
      <div className={cardClassName} data-testid='adminUnauthorizedCard'>
        <BrandName className='text-center' />
        <h3 className='text-3xl'>Admin access required</h3>
        <p className='text-muted-foreground'>
          Your account isn&apos;t authorized to use the Anonymous Systems admin dashboard.
          Sign out and use an account with admin access.
        </p>
        <Link href={AppRoutes.signOut}>
          <Button className='w-full' variant='outline' data-testid='signOutButton'>
            Sign out
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={cardClassName} data-testid='adminSignInCard'>
      <BrandName className='text-center' />
      <h3 className='text-3xl' data-testid='pageTitle'>Admin sign in</h3>
      <p className='text-muted-foreground'>
        Sign in with your admin Google account to manage Anonymous Systems.
      </p>
      <Button
        data-testid='googleSignInButton'
        loading={isLoading}
        onClick={handleSignIn}
      >
        <div className='mr-1'>
          {isLoading
            ? <Loader2Icon className="animate-spin" />
            : <GoogleSuperGIcon />}
        </div>
        Sign in with Google
      </Button>
    </div>
  )
}
