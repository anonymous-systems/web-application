/// <reference types="cypress" />

import { signInAnonymously, signOut, createUserWithEmailAndPassword, AuthErrorCodes, signInWithEmailAndPassword } from 'firebase/auth'
// @ts-ignore
import { getFirebaseAppCheck, getFirebaseAuth } from './firebase'
import { getToken } from 'firebase/app-check'

Cypress.Commands.add('login', () => {
  const apiLogin = (headers: HeadersInit) => {
    cy.request({
      method: 'GET',
      headers,
      url: '/api/login'
    })
  }

  const getOrCreateCypressUser = async (): Promise<string> => {
    const auth = getFirebaseAuth()

    // User is already signed in, return the current user
    if (auth.currentUser) return auth.currentUser.getIdToken()


    const email = 'cypress@user.com'
    const password = 'cypress-password'

    return signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => userCredential.user.getIdToken())
      .catch(error => {
        if (error.code === AuthErrorCodes.USER_DELETED) {
          // If the password is invalid, create a new user
          return createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => userCredential.user.getIdToken())
        }
        throw error
      })
  }

  cy.wrap(null).then(() => {
    // return signInAnonymously(getFirebaseAuth())
    //   .then(userCredential => userCredential.user.getIdToken())
    return getOrCreateCypressUser()
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
  })
})

Cypress.Commands.add('logout', () => {
  const apiLogout = (headers: HeadersInit) => {
    cy.request({
      method: 'GET',
      headers,
      url: '/api/logout'
    })
  }
  cy.wrap(null).then(() => {
    return signOut(getFirebaseAuth()).then(() => {
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
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
      logout(): Chainable<void>
    }
  }
}