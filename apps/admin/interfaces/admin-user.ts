/**
 * A user as shown in the admin Users section: Firebase Auth account data
 * merged with the Firestore `users/{uid}` profile document.
 */
export interface AdminUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  disabled: boolean
  isAdmin: boolean
  isCreator: boolean
  createdAt: string | null
  // Firestore profile (null when the user hasn't completed onboarding)
  firstName: string | null
  lastName: string | null
  username: string | null
  avatar: string | null
}
