'use client'

import { JSX, useState, useTransition } from 'react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/app-routes'
import { BrandName } from '@workspace/ui/components/brand-name'
import { Agreements } from '@/app/onboarding/_components/agreements'
import { ProfileSetup } from '@/app/onboarding/_components/profile-setup'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { Transition } from 'motion'
import { UserProfile } from '@workspace/ui/models/interfaces/user-profile'
import { onboardUser } from '@/services/user-service'
import { toast } from '@workspace/ui/components/sonner'
import { refreshCookies } from '@/app/_actions/refresh-cookies'
import { LoadingSpinner } from '@workspace/ui/components/loading-spinner'
import { useAuth } from '@/hooks/use-auth'

const Spinner = (): JSX.Element => (
  <div className="flex flex-col items-center justify-center h-60" aria-busy="true" aria-label="Loading">
    <LoadingSpinner />
    <span className="mt-4 text-lg text-muted-foreground animate-pulse">Loading, please wait…</span>
  </div>
)

type Direction = 'forward' | 'backward'

export const OnboardingCard = (): JSX.Element => {
  const [showProfile, setShowProfile] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<Direction>('forward')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshingCookies, startRefreshCookiesTransition] = useTransition()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const { user, clientUser } = useAuth()

  const handleFinishOnboarding = async (): Promise<void> => {
    if (userProfile == null) return

    console.debug('Onboarding user:', {userProfile, user, clientUser})

    setIsLoading(true)
    const success = await onboardUser(userProfile)
    if (success) {
      toast.success('Onboarding completed successfully!')
      startRefreshCookiesTransition(() => refreshCookies())
    }
    setIsLoading(false)
  }

  const handleNextStep = (): void => {
    setTransitionDirection('forward')
    setShowProfile(true)
  }

  const handlePreviousStep = (): void => {
    setTransitionDirection('backward')
    setShowProfile(false)
  }

  const transition: Transition = { duration: 0.2, ease: 'easeInOut' }

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

      {(isRefreshingCookies || isLoading)
        ? <Spinner />
        : (
          <AnimatePresence mode='wait'>
            {showProfile
              ? (
                <motion.div
                  key='profile'
                  className='flex flex-col gap-4'
                  initial={{ opacity: 0, y: transitionDirection === 'forward' ? 40 : -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: transitionDirection === 'backward' ? -40 : 40 }}
                  transition={transition}
                >
                  <ProfileSetup
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    onBack={handlePreviousStep}
                    onFinish={handleFinishOnboarding}
                  />
                </motion.div>
              )
              : (
                <motion.div
                  key='terms'
                  className='flex flex-col gap-4'
                  initial={{ opacity: 0, y: transitionDirection === 'forward' ? 40 : -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: transitionDirection === 'backward' ? -40 : 40 }}
                  transition={transition}
                >
                  <Agreements
                    onBack={() => { router.back() }}
                    onContinue={handleNextStep}
                  />
                </motion.div>
              )}
          </AnimatePresence>
        )}
    </div>
  )
}