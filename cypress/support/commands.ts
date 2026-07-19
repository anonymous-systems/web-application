/// <reference types="cypress" />

import { cypressSignIn, cypressSignInAdmin, cypressSignOut } from './user.service.js'

Cypress.Commands.add('login', (asOnboardingUser = false) => {
  cy.then(() => new Cypress.Promise((resolve, reject) => {
    cypressSignIn(asOnboardingUser).then(resolve).catch(reject)
  }))
})

Cypress.Commands.add('loginAdmin', (asOnboardingUser = false) => {
  cy.then(() => new Cypress.Promise((resolve, reject) => {
    cypressSignInAdmin(asOnboardingUser).then(resolve).catch(reject)
  }))
})

Cypress.Commands.add('logout', () => {
  cy.then(() => new Cypress.Promise((resolve, reject) => {
    cypressSignOut().then(resolve).catch(reject)
  }))
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(asOnboardingUser?: boolean): Chainable<void>
      loginAdmin(asOnboardingUser?: boolean): Chainable<void>
      logout(): Chainable<void>
    }
  }
}