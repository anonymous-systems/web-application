'use client'

import { UserProfile } from '@workspace/ui/models/interfaces/user-profile'
import { httpsCallable, FunctionsError } from 'firebase/functions'
import { getFirebaseFunctions } from '@workspace/firebase-config/client'
import { toast } from '@workspace/ui/components/sonner'

export const onboardUser = async (userProfile: UserProfile): Promise<boolean> => {
  try {
    const onboardUserFn = httpsCallable<typeof userProfile, boolean>(
      getFirebaseFunctions(),
      'user-onboard',
      { limitedUseAppCheckTokens: false }
    )
    const results = await onboardUserFn(userProfile)
      .catch(error => { throw error })
    return results.data
  } catch (error) {
    const { code, message } = error as FunctionsError
    const toastMessage = [
      'already-exists', 'failed-precondition', 'invalid-argument', 'unauthenticated'
    ].includes(code)
      ? message
      : 'Uh oh! Something went wrong while onboarding.'

    toast.error(toastMessage)
    console.error(error)
    return false
  }
}