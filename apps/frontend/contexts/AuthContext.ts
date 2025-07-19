import { createContext } from 'react'
import { User } from '@/interfaces/user'

export interface AuthContextValue {
  user: User | null
}

export const AuthContext = createContext<AuthContextValue>({
  user: null
})