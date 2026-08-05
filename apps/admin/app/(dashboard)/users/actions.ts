'use server'

import { revalidatePath } from 'next/cache'
import { getAuth } from 'firebase-admin/auth'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'
import { canManageAdminAccess } from '@/lib/admin-access'
import { getAdminCaller } from '@/lib/admin-caller'
import { AppRoutes } from '@/lib/app-routes'
import { UNEXPECTED } from '@/lib/errors'
import { ActionResult } from '@/interfaces/action-result'

/**
 * Grants or revokes the `admin` custom claim on a user. Re-verifies the caller
 * server-side (never trusts the client) and refuses self-modification. The
 * target's claim takes effect on their next ID-token refresh.
 */
export const setAdminAccess = async (
  targetUid: string,
  grant: boolean
): Promise<ActionResult> => {
  const caller = await getAdminCaller()
  if (!caller) return { ok: false, error: 'You must be signed in.' }

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
    return { ok: false, error: UNEXPECTED }
  }
}
