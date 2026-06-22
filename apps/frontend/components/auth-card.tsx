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

type AuthMode = 'sign-in' | 'sign-up'

interface AuthCardProps {
  mode: AuthMode
}

const config: Record<AuthMode, {
  title: string
  description: string
  buttonText: string
  errorMessage: string
  altText: string
  altLink: string
  altLinkText: string
  altLinkTestId: string
}> = {
  'sign-in': {
    title: 'Sign in',
    description: 'Sign in using your google account to continue',
    buttonText: 'Sign in with Google',
    errorMessage: 'Something went wrong while signing in. Please try again later.',
    altText: 'You don\'t have an account?',
    altLink: AppRoutes.signUp,
    altLinkText: 'Sign up',
    altLinkTestId: 'signUpButton',
  },
  'sign-up': {
    title: 'Sign up',
    description: 'Sign up using your google account to continue',
    buttonText: 'Sign up with Google',
    errorMessage: 'Something went wrong while signing up. Please try again later.',
    altText: 'You already have an account?',
    altLink: AppRoutes.signIn,
    altLinkText: 'Sign in',
    altLinkTestId: 'signInButton',
  },
}

export const AuthCard = ({ mode }: AuthCardProps): JSX.Element => {
  const { signIn, redirectAfterSignIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const {
    title, description, buttonText, errorMessage,
    altText, altLink, altLinkText, altLinkTestId,
  } = config[mode]

  const handleAuth = async (): Promise<void> => {
    setIsLoading(true)

    const success = await signIn()
    if (!success) {
      toast.error(errorMessage)
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

      <h3 className='text-3xl' data-testid='pageTitle'>{title}</h3>
      <p className='text-muted-foreground'>{description}</p>
      <Button
        data-testid='googleSignInButton'
        loading={isLoading}
        onClick={handleAuth}
      >
        <div className='mr-1'>
          {isLoading
          ? <Loader2Icon className="animate-spin" />
          : <GoogleSuperGIcon />}
        </div>
        {buttonText}
      </Button>

      <div className='flex justify-center align-items-center gap-1'>
        <p className='self-center'>{altText}</p>
        <Link href={altLink}>
          <Button variant='link' data-testid={altLinkTestId}>{altLinkText}</Button>
        </Link>
      </div>
    </div>
  )
}
