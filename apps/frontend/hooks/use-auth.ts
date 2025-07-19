import { User } from '@/interfaces/user'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

interface AuthType {
  user: User | null
}
export const useAuth = (): AuthType => {
  const auth = useContext(AuthContext)

  return {
    user: auth.user
  }
}