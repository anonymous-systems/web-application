import { JSX } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { getTokens } from 'next-firebase-auth-edge'
import { cookies } from 'next/headers'
import { ProfilePage } from '@/app/_pages/profile'
import { authConfig } from '@workspace/firebase-config/auth'
import { withServerFirestore } from '@workspace/firebase-config/server-firestore'
import { UserProfile } from '@workspace/ui/models/interfaces/user-profile'

const getUserProfile = async (): Promise<UserProfile | null> => {
  const tokens = await getTokens(await cookies(), authConfig)

  if (!tokens) {
    throw new Error('Could not get user profile of unauthenticated user')
  }

  // Read as the signed-in user rather than anonymously: `users/{uid}` is
  // world-readable today, but passing the token keeps this correct if that rule
  // is ever narrowed to the owner.
  return withServerFirestore(
    async (firestore) => {
      const snapshot = await getDoc(
        doc(firestore, 'users', tokens.decodedToken.uid)
      )

      return snapshot.exists() ? (snapshot.data() as UserProfile) : null
    },
    tokens.token
  )
}

const Page = async (): Promise<JSX.Element> => {
  const userProfile = await getUserProfile()

  return <ProfilePage userProfile={userProfile} />
}

export default Page
