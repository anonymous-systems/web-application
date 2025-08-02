import { createContext } from 'react'
import { User, AuthUser } from '@/interfaces/user'

export interface AuthContextValue {
  user: User | null
  clientUser: AuthUser | null
  isLoadingClientUser: boolean
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  clientUser: null,
  isLoadingClientUser: false
})