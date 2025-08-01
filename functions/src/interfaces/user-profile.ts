import { AddPrefixToKeys } from 'firebase-admin/firestore'

export interface UserProfile extends AddPrefixToKeys<string, never> {
  avatar?: string | null
  firstName: string
  lastName: string
  username: string
}
