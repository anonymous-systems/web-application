'use client'

import { UserProfile } from '@workspace/ui/models/interfaces/user-profile'

export const onboardUser = async (userProfile: UserProfile): Promise<boolean> => {
  try {
    console.debug('Sending user profile for onboarding:', { userProfile })
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}