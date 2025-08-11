import { JSX } from 'react'
import { SignOutCard } from '@/app/sign-out/_components/sign-out-card'

export const SignOutPage = (): JSX.Element => {
  return (
    <main
      className='grid place-items-center h-screen bg-background p-8 pb-22'
      data-testid='signOutPage'
    >
      <SignOutCard />
    </main>
  )
}