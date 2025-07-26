import { User } from '@/interfaces/user'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { signIn , signOut } from '@/services/AuthService'

interface AuthType {
  user: User | null
  signIn: () => Promise<boolean>
  signOut: () => Promise<boolean>
  redirectAfterSignIn: () => void
}
export const useAuth = (): AuthType => {
  const auth = useContext(AuthContext)
  const params = useSearchParams()
  const redirectPath = params.get('redirect')
  const router = useRouter()

  const redirectAfterSignIn = () => {
    if (redirectPath != null) router.push(redirectPath)

    router.refresh()
  }

  return {
    user: auth.user,
    signIn,
    signOut,
    redirectAfterSignIn
  }
}