import { HttpsError, onCall } from 'firebase-functions/https'
import { UserProfile } from '../interfaces/user-profile'
import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

initializeApp()

type UserOnboardRequest = UserProfile
type UserOnboardResponse = Promise<boolean>
const onboard = onCall<UserOnboardRequest, UserOnboardResponse>(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request): UserOnboardResponse => {
    if (request.auth == null) {
      throw new HttpsError(
        'unauthenticated',
        'You must be authenticated to perform this action.',
      )
    }

    const { avatar, firstName, lastName, username } = request.data
    const isAvatarValid = avatar == null ||
       (typeof avatar === 'string' && avatar.trim() !== '')
    const isFirstNameValid = typeof firstName === 'string' &&
      firstName.trim() !== '' &&
      /^[a-zA-Z]+$/.test(firstName)
    const isLastNameValid = typeof lastName === 'string' &&
      lastName.trim() !== '' &&
      /^[a-zA-Z]+$/.test(lastName)
    const isUsernameValid = typeof username === 'string' &&
      username.trim() !== '' &&
      /^[a-z0-9_-]+$/.test(username)

    if (
      !isAvatarValid ||
      !isFirstNameValid ||
      !isLastNameValid ||
      !isUsernameValid
    ) {
      throw new HttpsError(
        'invalid-argument',
        'The function must be called with a valid user profile.',
      )
    }

    const validAvatar = await getValidAvatar(avatar, request.auth.uid)

    const auth = getAuth()
    const userId = request.auth.uid
    const user = await auth.getUser(userId)
    if (user.customClaims?.onboardingComplete === true) {
      throw new HttpsError(
        'failed-precondition',
        'User onboarding is already complete.',
      )
    }

    const db = getFirestore()
    const userQuery = await db.collection('users')
      .where('username', '==', username)
      .get()
    if (!userQuery.empty) {
      throw new HttpsError(
        'already-exists',
        'The username is already taken. Please choose a different username.',
      )
    }

    try {
      const userProfile: UserProfile = {
        avatar: validAvatar || null,
        firstName,
        lastName,
        username,
      }
      const updatedClaims = { ...user.customClaims, onboardingComplete: true }

      await Promise.all([
        db.collection('users').doc(userId).set(userProfile),
        auth.updateUser(
          userId,
          {
            displayName: `${firstName} ${lastName}`,
            photoURL: validAvatar ?? null,
          }
        ),
        auth.setCustomUserClaims(userId, updatedClaims),
      ]).catch((error) => {
        throw error
      })

      return true
    } catch (error) {
      logger.error(error)
      return false
    }
  }
)

const getValidAvatar = async (
  avatar: string | null | undefined, userId: string
): Promise<string | null> => {
  if (avatar == null) return null

  if (avatar.startsWith('/avatars/')) {
    const projectId = process.env.GCLOUD_PROJECT ||
      JSON.parse(process.env.FIREBASE_CONFIG || '{}').projectId
    const baseUrl = process.env.BASE_URL || `https://${projectId}.web.app`
    return `${baseUrl}${avatar}`
  }

  if (avatar.startsWith('data:image')) {
    const matches = avatar.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!matches) return null
    const contentType = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')


    const storageBucket = getStorage().bucket()
    const filePath = `users/${userId}/avatar.webp`
    const file = storageBucket.file(filePath)

    await file.save(buffer, { metadata: { contentType } })

    await file.makePublic()
    return file.publicUrl()
  }

  if (/^https?:\/\//.test(avatar)) return avatar

  throw new HttpsError(
    'invalid-argument',
    'The avatar must be valid URL or base64 encoded image.'
  )
}

export { onboard }
