'use client'

import { User, AuthUser } from '@/interfaces/user'
import { JSX, ReactNode, useEffect, useState } from 'react'
import { AuthContext } from '@/contexts/auth-context'
import { getFirebaseAuth } from '@workspace/firebase-config/client'
import { onAuthStateChanged } from 'firebase/auth'

interface Props {
  user: User | null
  children: ReactNode
}
export const AuthProvider = (props: Props): JSX.Element => {
  const [clientUser, setClientUser] = useState<AuthUser | null>(null)
  const [isLoadingClientUser, setIsLoadingClientUser] = useState<boolean>(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    return onAuthStateChanged(auth, (user) => {
      setClientUser(user)
      setIsLoadingClientUser(false)
    })
  }, [props.user])

  return (
    <AuthContext.Provider value={{
      user: props.user,
      clientUser,
      isLoadingClientUser
    }}>{props.children}</AuthContext.Provider>
  )
}