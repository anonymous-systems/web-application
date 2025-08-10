import { Tokens } from 'next-firebase-auth-edge'
import { User } from '@/interfaces/user'
import { filterStandardClaims } from 'next-firebase-auth-edge/auth/claims'

export const toUser = ({ decodedToken }: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
    source_sign_in_provider: signInProvider,
  } = decodedToken

  const customClaims = filterStandardClaims(decodedToken)

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    providerId: signInProvider,
    customClaims,
  }
}