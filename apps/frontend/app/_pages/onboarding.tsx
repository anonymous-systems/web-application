import { JSX } from 'react'
import { OnboardingCard } from '@/app/onboarding/_components/onboarding-card'

export const OnboardingPage = (): JSX.Element => {
  return (
    <main
      className='grid place-items-center h-screen bg-background p-8 pb-22'
      data-testid='onboardingPage'
    >
      <OnboardingCard />
    </main>
  )
}