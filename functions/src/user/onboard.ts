import { HttpsError, onCall } from 'firebase-functions/https'
import { UserProfile } from '../interfaces/user-profile'
import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { getAuth } from 'firebase-admin/auth'

type UserOnboardRequest = UserProfile
type UserOnboardResponse = Promise<boolean>
const onboard = onCall<UserOnboardRequest, UserOnboardResponse>(
  { enforceAppCheck: false, consumeAppCheckToken: false },
  async (request): UserOnboardResponse => {
    if (request.auth == null) {
      throw new HttpsError(
        'unauthenticated',
        'You must be authenticated to perform this action.',
      )
    }

    const { avatar, firstName, lastName, username } = request.data
    const validAvatar = avatar == null ||
      avatar !== '' || typeof avatar === 'string'
    const validFirstName = typeof firstName === 'string' ||
      firstName !== '' ||
      /^[a-zA-Z]+$/.test(firstName)
    const validLastName = typeof lastName === 'string' ||
      lastName !== '' ||
      /^[a-zA-Z]+$/.test(lastName)
    const validUsername = typeof username === 'string' ||
      username !== '' ||
      /^[a-z0-9-]+$/.test(username)

    if (!validAvatar || !validFirstName || !validLastName || !validUsername) {
      throw new HttpsError(
        'invalid-argument',
        'The function must be called with a valid user profile.',
      )
    }

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
        avatar: avatar || null,
        firstName,
        lastName,
        username,
      }
      const updatedClaims = { ...user.customClaims, onboardingComplete: true }

      await Promise.all([
        db.collection('users').doc(userId).update(userProfile),
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

export { onboard }
