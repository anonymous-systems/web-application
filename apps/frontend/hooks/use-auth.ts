import { User } from '@/interfaces/user'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { signIn , signOut } from '@/services/AuthService'

interface AuthType {
  user: User | null
  signIn: () => Promise<boolean>
  signOut: () => Promise<boolean>
}
export const useAuth = (): AuthType => {
  const auth = useContext(AuthContext)

  return {
    user: auth.user,
    signIn,
    signOut
  }
}