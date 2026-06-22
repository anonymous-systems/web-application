import { User, AuthUser } from '@/interfaces/user'
import { useAuthContext } from '@/hooks/use-auth-context'
import { useAuthService } from '@/hooks/use-auth-service'
import { useAuthNavigation } from '@/hooks/use-auth-navigation'

interface AuthType {
  user: User | null
  clientUser: AuthUser | null
  isLoadingClientUser: boolean
  signIn: () => Promise<boolean>
  signOut: () => Promise<boolean>
  redirectAfterSignIn: () => void
}

export const useAuth = (): AuthType => ({
  ...useAuthContext(),
  ...useAuthService(),
  ...useAuthNavigation(),
})