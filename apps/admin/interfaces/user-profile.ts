/** The Firestore `users/{uid}` profile document. Every field is optional
 *  because a user may not have completed onboarding. */
export interface UserProfileDoc {
  firstName?: string
  lastName?: string
  username?: string
  avatar?: string | null
}
