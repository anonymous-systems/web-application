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
