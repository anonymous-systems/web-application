import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'
import { hasAdminClaim } from '@/lib/admin-access'
import { AdminUser } from '@/interfaces/admin-user'
import { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'

/**
 * Lists every user for the admin Users section, merging each Firebase Auth
 * account with its Firestore `users/{uid}` profile. Server-only (Admin SDK).
 */
export const listUsers = async (): Promise<AdminUser[]> => {
  const app = getFirebaseAdminApp()

  const [{ users }, profilesSnap] = await Promise.all([
    getAuth(app).listUsers(1000),
    getFirestore(app).collection('users').get(),
  ])

  const profiles = new Map<string, UserProfileDoc>()
  profilesSnap.forEach((doc) => profiles.set(doc.id, doc.data() as UserProfileDoc))

  return users
    .map((user): AdminUser => {
      const profile = profiles.get(user.uid)
      const claims = user.customClaims ?? {}

      return {
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        disabled: user.disabled,
        isAdmin: hasAdminClaim(claims),
        isCreator: claims.creator === true,
        createdAt: user.metadata.creationTime ?? null,
        firstName: profile?.firstName ?? null,
        lastName: profile?.lastName ?? null,
        username: profile?.username ?? null,
        avatar: profile?.avatar ?? null,
      }
    })
    .sort((a, b) => (a.email ?? '').localeCompare(b.email ?? ''))
}
