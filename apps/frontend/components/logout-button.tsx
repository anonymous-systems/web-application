'use client'

import { JSX } from 'react'
import { Button } from '@workspace/ui/components/button'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@workspace/firebase-config/client'

export const LogoutButton = (): JSX.Element => {
  const router = useRouter()

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth)
      await fetch('/api/logout', { method: 'GET', headers: {} })
      router.refresh() // refresh page after updating browser cookies
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <Button onClick={handleSignOut}>Sign out</Button>
  )
}