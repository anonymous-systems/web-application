'use server'

import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getAuth } from 'firebase-admin/auth'
import { getTokens } from 'next-firebase-auth-edge'
import { authConfig } from '@workspace/firebase-config/auth'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'
import { canManageAdminAccess, hasAdminClaim } from '@/lib/admin-access'
import { AppRoutes } from '@/lib/app-routes'

export interface ActionResult {
  ok: boolean
  error?: string
}

/**
 * Grants or revokes the `admin` custom claim on a user. Re-verifies the caller
 * server-side (never trusts the client) and refuses self-modification. The
 * target's claim takes effect on their next ID-token refresh.
 */
export const setAdminAccess = async (
  targetUid: string,
  grant: boolean
): Promise<ActionResult> => {
  const tokens = await getTokens(
    await cookies(),
    { ...authConfig, headers: await headers() }
  )
  if (!tokens) return { ok: false, error: 'You must be signed in.' }

  const caller = {
    uid: tokens.decodedToken.uid,
    isAdmin: hasAdminClaim(tokens.decodedToken),
  }
  const decision = canManageAdminAccess(caller, targetUid)
  if (!decision.allowed) return { ok: false, error: decision.reason }

  try {
    const auth = getAuth(getFirebaseAdminApp())
    const user = await auth.getUser(targetUid)
    await auth.setCustomUserClaims(targetUid, {
      ...user.customClaims,
      admin: grant,
    })
    revalidatePath(AppRoutes.users)
    return { ok: true }
  } catch (error) {
    console.error('Failed to set admin access', error)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}
