import { JSX } from 'react'
import { AuthCard } from '@/components/auth-card'

export const SignInPage = (): JSX.Element => {
  return (
    <main
      data-testid='signInPage'
      className='grid place-items-center h-screen bg-background p-8 pb-22'
    >
      <AuthCard mode='sign-in' />
    </main>
  )
}