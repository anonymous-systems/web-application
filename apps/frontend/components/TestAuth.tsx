'use client'

import { JSX } from 'react'
import { LoginButton } from '@/components/login-button'
import { LogoutButton } from '@/components/logout-button'
import { useAuth } from '@/hooks/use-auth'

export const TestAuth = (): JSX.Element => {
  const { user } = useAuth()

  if (user == null) return <LoginButton />
  else return <LogoutButton />
}