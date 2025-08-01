import { JSX } from 'react'
import { ProfilePage } from '@/app/_pages/profile'
import { getFirestore } from 'firebase-admin/firestore'
import { getTokens } from 'next-firebase-auth-edge'
import { cookies } from 'next/headers'
import { authConfig } from '@workspace/firebase-config/auth'
import { UserProfile } from '@workspace/ui/models/interfaces/user-profile'
import { getFirebaseAdminApp } from '@/app/firebase'

const db = getFirestore(getFirebaseAdminApp())
const getUserProfile = async (): Promise<UserProfile> => {
  const tokens = await getTokens(await cookies(), authConfig)

  if (!tokens) {
    throw new Error('Could not get user profile of unauthenticated user')
  }

  const snapshot = await db
    .collection('users')
    .doc(tokens.decodedToken.uid)
    .get()

  return snapshot.data() as UserProfile
}
const Page = async (): Promise<JSX.Element> => {
  const userProfile = await getUserProfile()
  console.debug('User profile:', { userProfile })

  return (
    <ProfilePage />
  )
}

export default Page