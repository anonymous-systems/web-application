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
    .catch((error: FunctionsError) => {
      const messages: Partial<Record<FunctionsError['code'], string>> = {
        'functions/already-exists':
          'That username is already taken. Please choose a different one.',
        'functions/failed-precondition':
          'Your profile has already been set up.',
        'functions/invalid-argument':
          'Please check your information and try again.',
        'functions/unauthenticated':
          'You need to be signed in to continue.',
      }

      if (error.code in messages) {
        toast.error(messages[error.code])
      } else if (
        error.code === 'functions/internal' &&
        error.details != null &&
        typeof error.details === 'object' &&
        'errorId' in error.details
      ) {
        const { errorId } = error.details as { errorId: string }
        toast.error('Profile setup failed', {
          description:
            `Please try again. If the issue persists, contact support ` +
            `with reference: ${errorId}`,
        })
      } else {
        toast.error('Profile setup failed', {
          description: 'Please try again or refresh the page.',
        })
      }

      return false
    })
}