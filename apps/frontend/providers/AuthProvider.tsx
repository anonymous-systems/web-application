'use client'

import { User } from '@/interfaces/user'
import { JSX, ReactNode } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

interface Props {
  user: User | null
  children: ReactNode
}
export const AuthProvider = (props: Props): JSX.Element => {
  return (
    <AuthContext.Provider value={{user: props.user}}>{props.children}</AuthContext.Provider>
  )
}