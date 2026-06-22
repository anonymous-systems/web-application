import { randomUUID } from 'crypto'
import { HttpsError, onCall } from 'firebase-functions/https'
import { UserProfile } from '../interfaces/user-profile'
import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

initializeApp()

type UserOnboardRequest = UserProfile
type UserOnboardResponse = Promise<true>
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
      /^[a-z0-9_-]+$/.test(username) &&
      !/^__.*__$/.test(username)

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

    const userProfile: UserProfile = {
      avatar: validAvatar || null,
      firstName,
      lastName,
      username,
    }

    try {
      await db.runTransaction(async (transaction) => {
        const usernameRef = db.collection('usernames').doc(username)
        const usernameSnap = await transaction.get(usernameRef)

        if (usernameSnap.exists) {
          throw new HttpsError(
            'already-exists',
            'Unable to complete setup. Please try a different username.',
          )
        }

        transaction.set(usernameRef, { userId })
        transaction.set(db.collection('users').doc(userId), userProfile)
      })

      const updatedClaims = { ...user.customClaims, onboardingComplete: true }
      await Promise.all([
        auth.updateUser(userId, {
          displayName: `${firstName} ${lastName}`,
          photoURL: validAvatar ?? null,
        }),
        auth.setCustomUserClaims(userId, updatedClaims),
      ])

      return true
    } catch (error) {
      if (error instanceof HttpsError) throw error
      const errorId = randomUUID().slice(0, 8).toUpperCase()
      logger.error({ errorId, error })
      throw new HttpsError(
        'internal',
        'An unexpected error occurred. Please try again.',
        { errorId },
      )
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
    if (!matches || !matches[1] || !matches[2]) return null
    const contentType = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')
    if (buffer.length > 5 * 1024 * 1024) {
      throw new HttpsError(
        'invalid-argument',
        'Avatar image must be 5MB or less.',
      )
    }

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
