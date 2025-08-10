import { UserInfo, type User as AuthUser } from 'firebase/auth'
import { Claims } from 'next-firebase-auth-edge/auth/claims'

export interface User extends UserInfo {
  emailVerified: boolean
  customClaims: Claims
}

export { AuthUser }