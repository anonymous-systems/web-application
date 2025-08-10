'use client'

import { UserProfile } from '@workspace/ui/models/interfaces/user-profile'
import { httpsCallable, FunctionsError } from 'firebase/functions'
import { getFirebaseFunctions } from '@workspace/firebase-config/client'
import { toast } from '@workspace/ui/components/sonner'

export const onboardUser = async (userProfile: UserProfile): Promise<boolean> => {
  const onboardUserFn = httpsCallable<typeof userProfile, boolean>(
    getFirebaseFunctions(),
    'user-onboard',
    { limitedUseAppCheckTokens: true }
  )
  return onboardUserFn(userProfile)
    .then(res => res.data)
    .catch((error: FunctionsError)=> {
      let errorMessage = 'Uh oh! Something went wrong while onboarding.'

      if ([
        'functions/already-exists',
        'functions/failed-precondition',
        'functions/invalid-argument',
        'functions/unauthenticated'
      ].includes(error.code)) {
        errorMessage = error.message
      } else console.error(error)

      toast.error(errorMessage)

      return false
    })
}