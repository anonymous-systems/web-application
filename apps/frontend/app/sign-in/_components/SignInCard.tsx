'use client'

import { JSX, useState } from 'react'
import { BrandName } from '@workspace/ui/components/brand-name'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { useAuth } from '@/hooks/use-auth'
import { AppRoutes } from '@/lib/app-routes'
import Link from 'next/link'
import { toast } from '@workspace/ui/components/sonner'
import { useRouter } from 'next/navigation'

export const SignInCard = (): JSX.Element => {
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (): Promise<void> => {
    setIsLoading(true)

    const success = await signIn()
    if (!success) {
      toast.error('Something went wrong while signing in. Please try again later.')
    } else {
      router.refresh()
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

      <h3 className='text-3xl'>Sign in</h3>
      <p className='text-muted-foreground'>Sign in using your google account to continue</p>
      <Button loading={isLoading} onClick={handleSignIn}>
        {isLoading && <Loader2Icon className="animate-spin" />}
        Sign in with Google
      </Button>

      <div className='flex justify-center align-items-center gap-1'>
            <p className='self-center'>You don't have an account?</p>
            <Link href={AppRoutes.signUp}>
              <Button variant='link'>Sign up</Button>
            </Link>
          </div>
    </div>
  )
}