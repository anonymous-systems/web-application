'use client'

import { JSX, useState } from 'react'
import { BrandName } from '@workspace/ui/components/brand-name'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { useAuth } from '@/hooks/use-auth'
import { AppRoutes } from '@/lib/app-routes'
import Link from 'next/link'
import { toast } from '@workspace/ui/components/sonner'
import { GoogleSuperGIcon } from '@workspace/ui/assets/icons/GoogleSuperGIcon'

export const SignUpCard = (): JSX.Element => {
  const { signIn, redirectAfterSignIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (): Promise<void> => {
    setIsLoading(true)

    const success = await signIn()
    if (!success) {
      toast.error('Something went wrong while signing up. Please try again later.')
    } else {
      redirectAfterSignIn()
    }

    setIsLoading(false)
  }

  return (
    <div
      className={[
        'flex flex-col gap-4 bg-card',
        'text-card-foreground rounded-lg',
        'outline p-8 max-w-[400px] shadow-sm'
      ].join(' ')}
    >
      <Link href={AppRoutes.home}>
        <BrandName className='text-center' />
      </Link>

      <h3 className='text-3xl'>Sign up</h3>
      <p className='text-muted-foreground'>Sign up using your google account to continue</p>
      <Button loading={isLoading} onClick={handleSignUp}>
        <div className='mr-1'>
          {isLoading
          ? <Loader2Icon className="animate-spin" />
          : <GoogleSuperGIcon />}
        </div>
        Sign up with Google
      </Button>

      <div className='flex justify-center align-items-center gap-1'>
        <p className='self-center'>You already have an account?</p>
        <Link href={AppRoutes.signIn}>
          <Button variant='link'>Sign in</Button>
        </Link>
      </div>
    </div>
  )
}