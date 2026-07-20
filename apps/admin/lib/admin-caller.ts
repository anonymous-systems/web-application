import { cookies, headers } from 'next/headers'
import { getTokens } from 'next-firebase-auth-edge'
import { authConfig } from '@workspace/firebase-config/auth'
import { hasAdminClaim } from '@/lib/admin-access'

export interface AdminCaller {
  uid: string
  isAdmin: boolean
}

/**
 * Resolves the signed-in admin from the request cookies. Server-only: every
 * server action re-verifies the caller through this rather than trusting the
 * client. Kept out of `admin-access.ts` because that module is also imported by
 * the edge middleware, which cannot use `next/headers`.
 */
export const getAdminCaller = async (): Promise<AdminCaller | null> => {
  const tokens = await getTokens(
    await cookies(),
    { ...authConfig, headers: await headers() }
  )
  if (!tokens) return null

  return {
    uid: tokens.decodedToken.uid,
    isAdmin: hasAdminClaim(tokens.decodedToken),
  }
}
