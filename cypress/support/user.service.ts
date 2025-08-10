import {
  Auth,
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
// @ts-ignore
import { getFirebaseAppCheck, getFirebaseAuth } from './firebase'
import { getToken } from 'firebase/app-check'

const USERS: Record<string, { email: string, password: string }> = {
    default: { email: 'cypress@user.com', password: 'cypress-password' },
    onboarding: { email: 'onboarding@user.com', password: 'onboarding-password' }
  }

const apiLogin = (headers: HeadersInit) => {
  cy.request({ method: 'GET', headers, url: '/api/login' })
}

const apiLogout = (headers: HeadersInit) => {
  cy.request({ method: 'GET', headers, url: '/api/logout' })
}

const getOrCreateCypressUser = async (asOnboardingUser: boolean): Promise<string> => {
  const auth: Auth = getFirebaseAuth()
  const { email, password } = asOnboardingUser ? USERS.onboarding : USERS.default

  // If signed in as the correct user, return token
  if (auth.currentUser && auth.currentUser.email === email) return auth.currentUser.getIdToken()

  // If already signed in as a different user, sign out first
  if (auth.currentUser && auth.currentUser.email !== email) await signOut(auth)

  return signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => userCredential.user.getIdToken())
    .catch(error => {
      if (error.code === AuthErrorCodes.USER_DELETED) {
        return createUserWithEmailAndPassword(auth, email, password)
          .then(userCredential => userCredential.user.getIdToken())
      }
      throw error
    })
}

export const cypressSignIn = (asOnboardingUser: boolean): Promise<void> => getOrCreateCypressUser(asOnboardingUser)
  .then(idToken => {
    const headers: HeadersInit = { Authorization: `Bearer ${idToken}` }
    if (Cypress.env('firebaseRecaptchaSiteKey')) {
      getToken(getFirebaseAppCheck()).then(tokenResponse => {
        headers["X-Firebase-AppCheck"] = tokenResponse.token
        return apiLogin(headers)
      })
    }

    return apiLogin(headers)
  })

export const cypressSignOut = (): Promise<void> => signOut(getFirebaseAuth())
  .then(() => {
    const headers: Record<string, string> = {};
    if (Cypress.env('firebaseRecaptchaSiteKey')) {
    return getToken(getFirebaseAppCheck(), false)
      .then(tokenResponse => {
        headers["X-Firebase-AppCheck"] = tokenResponse.token
        return apiLogout(headers)
      })
    }

    return apiLogout(headers)
  })