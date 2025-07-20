'use client'

import { JSX, ReactNode, useState } from 'react'
import { TopAppBar } from '@/components/top-app-bar'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@workspace/ui/components/sonner'
import { useRouter } from 'next/navigation'

interface Props {
  children: ReactNode
}
export const Layout = (props: Props): JSX.Element => {
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async (): Promise<void> => {
    setIsLoading(true)
    const success = await signOut()
    if (success) {
      toast.success('You have been signed out successfully.')
      router.refresh()
    } else {
      toast.error('Something went wrong while signing out.')
    }
    setIsLoading(false)
  }

  return (
    <div>
      <TopAppBar user={user} onSignOut={handleSignOut} isLoading={isLoading} />
      <main>{props.children}</main>
    </div>
  )
}