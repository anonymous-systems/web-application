'use client'

import { JSX } from 'react'
import { Button } from '@workspace/ui/components/button'
import { GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth'
import { toast } from '@workspace/ui/components/sonner'
import { useRouter } from 'next/navigation'
import { auth } from '@workspace/firebase-config/client'

export const LoginButton = (): JSX.Element => {
  const router = useRouter()

  const signInWithGoogle = async (): Promise<UserCredential | null> => {
    try {
      const provider = new GoogleAuthProvider()

      return signInWithPopup(auth, provider)
        .catch((error) => { throw error })
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const handleSignInWithGoogle = async () => {
    const credential = await signInWithGoogle()
    if (credential == null) {
      toast.error('Something went wrong while signing in with Google.')
      return
    }
    const idToken = await credential.user.getIdToken()

    await fetch('/api/login', { headers: { Authorization: `Bearer ${idToken}` } })

    router.refresh() // refresh page after updating browser cookies
  }

  return (
    <Button onClick={handleSignInWithGoogle}>Sign in with Google</Button>
  )
}