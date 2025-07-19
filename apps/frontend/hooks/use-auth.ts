import { User } from '@/interfaces/user'
import { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { signIn as _signIn, signOut as _signOut } from '@/services/AuthService'
import { useRouter } from 'next/navigation'
import { toast } from '@workspace/ui/components/sonner'

interface AuthType {
  isLoading: boolean
  user: User | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}
export const useAuth = (): AuthType => {
  const auth = useContext(AuthContext)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const signIn = async (): Promise<void> => {
    setIsLoading(true)

    const success = await _signIn()
    if (!success) {
      toast.error('Something went wrong while signing in.')
    } else {
      router.refresh() // refresh page after updating browser cookies
    }

    setIsLoading(false)
  }

  const signOut = async (): Promise<void> => {
    setIsLoading(true)

    const success = await _signOut()
    if (!success) {
      toast.error('Something went wrong while signing out.')
    } else {
      router.refresh() // refresh page after updating browser cookies
    }

    setIsLoading(false)
  }

  return {
    isLoading,
    user: auth.user,
    signIn,
    signOut
  }
}