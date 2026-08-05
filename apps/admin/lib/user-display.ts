import { UserProfileDoc } from '@/interfaces/user-profile'

/**
 * The author's display name from their `users/{uid}` profile, or null when
 * unknown — so callers can fall back to their own label without this layer
 * knowing about it. Shared by the comment and story services.
 */
export const resolveAuthorName = (profile?: UserProfileDoc): string | null =>
  [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || null
