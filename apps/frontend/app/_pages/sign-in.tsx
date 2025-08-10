import { JSX } from 'react'
import { SignInCard } from '@/app/sign-in/_components/SignInCard'

export const SignInPage = (): JSX.Element => {
  return (
    <main
      data-testid='signInPage'
      className='grid place-items-center h-screen bg-background p-8 pb-22'
    >
      <SignInCard />
    </main>
  )
}