import { signIn, signOut } from '@/services/auth-service'

interface AuthService {
  signIn: () => Promise<boolean>
  signOut: () => Promise<boolean>
}

export const useAuthService = (): AuthService => ({ signIn, signOut })
