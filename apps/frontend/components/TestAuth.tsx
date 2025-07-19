'use client'

import { JSX, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@workspace/ui/components/button'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@workspace/ui/components/sonner'

export const TestAuth = (): JSX.Element => {
  const { user, signIn, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (): Promise<void> => {
    setIsLoading(true)

    const success = await signIn()
    if (success) {
      router.refresh()
    } else {
      toast.error('Something went wrong while signing in.')
    }

    setIsLoading(false)
  }

  const handleSignOut = async (): Promise<void> => {
    setIsLoading(true)

    const success = await signOut()
    if (success) {
      router.refresh()
    } else {
      toast.error('Something went wrong while signing out.')
    }

    setIsLoading(false)
  }


  return (
    user == null
      ? (
        <Button loading={isLoading} onClick={handleSignIn}>
          {isLoading && <Loader2Icon className="animate-spin" />}
          Sign in with Google
        </Button>
      )
      : (
        <Button loading={isLoading} onClick={handleSignOut}>
          {isLoading && <Loader2Icon className="animate-spin" />}
          Sign out
        </Button>
      )
  )
}