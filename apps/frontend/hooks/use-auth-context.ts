import { useContext } from 'react'
import { AuthContext, AuthContextValue } from '@/contexts/auth-context'

export const useAuthContext = (): AuthContextValue => useContext(AuthContext)
