import { JSX } from 'react'
import { WelcomeCard } from '@/app/welcome/_components/WelcomeCard'

export const WelcomePage = (): JSX.Element => {
  return (
    <main
      className='grid place-items-center h-screen bg-background p-8 pb-22'
      data-testid='welcomePage'
    >
      <WelcomeCard />
    </main>
  )
}