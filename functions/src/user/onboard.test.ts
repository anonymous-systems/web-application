import { HttpsError } from 'firebase-functions/https'
import { UserProfile } from '../interfaces/user-profile'

jest.mock('firebase-admin/app', () => ({ initializeApp: jest.fn() }))
jest.mock('firebase-admin/firestore', () => ({ getFirestore: jest.fn() }))
jest.mock('firebase-admin/auth', () => ({ getAuth: jest.fn() }))
jest.mock('firebase-admin/storage', () => ({ getStorage: jest.fn() }))
jest.mock('firebase-functions', () => ({ logger: { error: jest.fn() } }))

import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { logger } from 'firebase-functions'
import { onboard } from './onboard'

const AUTH = { uid: 'u1' }
const VALID_PROFILE: UserProfile = {
  avatar: null,
  firstName: 'Jane',
  lastName: 'Doe',
  username: 'janedoe',
}

const buildRequest = (
  data: Partial<UserProfile>, auth?: { uid: string },
) => ({
  data: { ...VALID_PROFILE, ...data },
  auth,
}) as Parameters<typeof onboard.run>[0]

interface MockTransaction {
  get: jest.Mock
  set: jest.Mock
}

const setupFirestoreMock = (usernameExists: boolean): MockTransaction => {
  const transaction: MockTransaction = {
    get: jest.fn().mockResolvedValue({ exists: usernameExists }),
    set: jest.fn(),
  }
  const db = {
    collection: jest.fn((name: string) => ({
      doc: jest.fn((id: string) => ({ collection: name, id })),
    })),
    runTransaction: jest.fn(
      async (fn: (t: MockTransaction) => Promise<void>) => {
        await fn(transaction)
      },
    ),
  }
  ;(getFirestore as jest.Mock).mockReturnValue(db)
  return transaction
}

const setupAuthMock = (
  { onboardingComplete = false }: { onboardingComplete?: boolean } = {},
) => {
  const auth = {
    getUser: jest.fn().mockResolvedValue({
      customClaims: { onboardingComplete },
    }),
    updateUser: jest.fn().mockResolvedValue(undefined),
    setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
  }
  ;(getAuth as jest.Mock).mockReturnValue(auth)
  return auth
}

describe('onboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('throws unauthenticated when there is no auth context', async () => {
    await expect(onboard.run(buildRequest({}, undefined)))
      .rejects.toMatchObject({ code: 'unauthenticated' })
  })

  it('throws invalid-argument for a malformed first name', async () => {
    const request = buildRequest({ firstName: 'J4ne' }, AUTH)
    await expect(onboard.run(request))
      .rejects.toMatchObject({ code: 'invalid-argument' })
  })

  it('throws invalid-argument for an uppercase username', async () => {
    const request = buildRequest({ username: 'JaneDoe' }, AUTH)
    await expect(onboard.run(request))
      .rejects.toMatchObject({ code: 'invalid-argument' })
  })

  it('throws invalid-argument for a Firestore-reserved username', async () => {
    const request = buildRequest({ username: '__admin__' }, AUTH)
    await expect(onboard.run(request))
      .rejects.toMatchObject({ code: 'invalid-argument' })
  })

  it('throws failed-precondition if onboarding is already done', async () => {
    setupAuthMock({ onboardingComplete: true })

    await expect(onboard.run(buildRequest({}, AUTH)))
      .rejects.toMatchObject({ code: 'failed-precondition' })
  })

  it('throws already-exists without confirming a username exists', async () => {
    setupAuthMock()
    setupFirestoreMock(true)

    const error: HttpsError = await onboard.run(buildRequest({}, AUTH))
      .catch((e) => e)

    expect(error.code).toBe('already-exists')
    expect(error.message.toLowerCase()).not.toContain('is already taken')
  })

  it('reserves the username and creates the profile atomically', async () => {
    const auth = setupAuthMock()
    const transaction = setupFirestoreMock(false)

    const result = await onboard.run(buildRequest({}, AUTH))

    expect(result).toBe(true)
    expect(transaction.set).toHaveBeenCalledTimes(2)
    expect(transaction.set).toHaveBeenCalledWith(
      { collection: 'usernames', id: 'janedoe' },
      { userId: 'u1' },
    )
    expect(auth.setCustomUserClaims).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({ onboardingComplete: true }),
    )
  })

  it('rejects an avatar over the 5MB limit', async () => {
    setupAuthMock()
    setupFirestoreMock(false)

    const oversized = `data:image/png;base64,${'A'.repeat(7 * 1024 * 1024)}`
    const request = buildRequest({ avatar: oversized }, AUTH)

    await expect(onboard.run(request))
      .rejects.toMatchObject({ code: 'invalid-argument' })
  })

  it('wraps unexpected errors in a generic, traceable error', async () => {
    const auth = setupAuthMock()
    setupFirestoreMock(false)
    auth.updateUser.mockRejectedValue(new Error('network blip'))

    const error: HttpsError = await onboard.run(buildRequest({}, AUTH))
      .catch((e) => e)
    const { errorId } = error.details as { errorId: string }

    expect(error.code).toBe('internal')
    expect(error.message).not.toContain('network blip')
    expect(errorId).toMatch(/^[0-9A-F]{8}$/)
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(Error) }),
    )
  })
})
