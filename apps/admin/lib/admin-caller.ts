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

type AdminGuard =
  | { ok: true; caller: AdminCaller }
  | { ok: false; error: string }

/**
 * Guards a server action to admins: returns the caller on success, or an
 * ActionResult-shaped failure to hand straight back to the client. `resource`
 * names what's being managed, e.g. "stories" → "You must be an admin to manage
 * stories."
 */
export const ensureAdmin = async (resource: string): Promise<AdminGuard> => {
  const caller = await getAdminCaller()
  if (!caller?.isAdmin) {
    return { ok: false, error: `You must be an admin to manage ${resource}.` }
  }

  return { ok: true, caller }
}
