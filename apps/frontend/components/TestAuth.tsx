'use client'

import { JSX } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@workspace/ui/components/button'
import { Loader2Icon } from 'lucide-react'

export const TestAuth = (): JSX.Element => {
  const { isLoading, user, signIn, signOut } = useAuth()

  return (
    user == null
      ? (
        <Button loading={isLoading} onClick={signIn}>
          {isLoading && <Loader2Icon className="animate-spin" />}
          Sign in with Google
        </Button>
      )
      : (
        <Button loading={isLoading} onClick={signOut}>
          {isLoading && <Loader2Icon className="animate-spin" />}
          Sign out
        </Button>
      )
  )
}