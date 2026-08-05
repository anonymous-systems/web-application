/**
 * Admin access is granted exclusively through the `admin` Firebase custom claim,
 * mirroring the Firestore security rules (`request.auth.token.admin == true`).
 */
export const ADMIN_CLAIM = 'admin'

/**
 * Returns true only when the provided claims contain `admin: true`.
 *
 * Accepts either a decoded ID token (in the middleware) or a user's filtered
 * custom claims (in server components), since both expose claims as a flat record.
 */
export const hasAdminClaim = (
  claims: Record<string, unknown> | null | undefined
): boolean => claims?.[ADMIN_CLAIM] === true

export interface AdminAccessDecision {
  allowed: boolean
  reason?: string
}

/**
 * Whether `caller` may grant/revoke the admin claim on `targetUid`. The caller
 * must be an admin, and nobody may change their own admin access — this
 * prevents an admin from accidentally locking themselves out.
 */
export const canManageAdminAccess = (
  caller: { uid: string; isAdmin: boolean },
  targetUid: string
): AdminAccessDecision => {
  if (!caller.isAdmin) {
    return { allowed: false, reason: 'You must be an admin to manage admin access.' }
  }
  if (caller.uid === targetUid) {
    return { allowed: false, reason: 'You can’t change your own admin access.' }
  }
  return { allowed: true }
}
