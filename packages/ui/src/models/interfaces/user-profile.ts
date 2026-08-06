export interface UserProfile {
  avatar: string | null
  firstName: string
  lastName: string
  username: string
}

/**
 * The Firestore `users/{uid}` profile document. Every field is optional because
 * a user may not have completed onboarding. Shared by the admin and frontend
 * read layers, which both resolve story/project authors from these documents.
 */
export interface UserProfileDoc {
  firstName?: string
  lastName?: string
  username?: string
  avatar?: string | null
}
