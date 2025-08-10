import { JSX } from 'react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/app-routes'
import { Logo } from '@/components/logo'
import { Button } from '@workspace/ui/components/button'
import { CompanyInformation } from '@workspace/ui/lib/company-information'

export const WelcomeCard = (): JSX.Element => {
  const { name, byline } = CompanyInformation

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
          <div className='text-3xl' data-testid='pageTitle'>Welcome to {name}</div>
          <div className='text-sm text-muted-foreground'>{byline}</div>
        </div>
        <Link href={AppRoutes.signIn}>
          <Button className='w-full' data-testid='getStartedButton'>Get Started</Button>
        </Link>
        <div className='flex justify-center align-items-center gap-1'>
          <p className='self-center'>You already have an account?</p>
          <Link href={AppRoutes.signIn}>
            <Button variant='link' data-testid='signInButton'>Sign in</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}