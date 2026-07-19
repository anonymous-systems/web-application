/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')
const ADMIN_EMAIL = 'cypress@user.com'
const MEMBER_EMAIL = 'onboarding@user.com'

const userRow = (email: string) =>
  cy.get(`[data-testid="userRow"][data-email="${email}"]`)

describe('Admin Users section', () => {
  it('lists users and flags admins', () => {
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/users`)

    cy.get('[data-testid="usersPage"]').should('exist')
    cy.get('[data-testid="usersTable"]').should('exist')
    cy.get('[data-testid="userRow"]').should('have.length.at.least', 2)

    userRow(ADMIN_EMAIL).should('contain', 'Admin')
  })

  it('disables changing your own admin access', () => {
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/users`)

    userRow(ADMIN_EMAIL).find('[data-testid="userActionsTrigger"]').click()
    cy.get('[data-testid="toggleAdminItem"]').should('have.attr', 'data-disabled')
  })

  it('grants and revokes admin access for another user', () => {
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/users`)

    userRow(MEMBER_EMAIL).should('not.contain', 'Admin')

    // Grant
    userRow(MEMBER_EMAIL).find('[data-testid="userActionsTrigger"]').click()
    cy.get('[data-testid="toggleAdminItem"]').should('contain', 'Grant admin').click()
    userRow(MEMBER_EMAIL).should('contain', 'Admin')

    // Revoke — restores the original state so the test is idempotent
    userRow(MEMBER_EMAIL).find('[data-testid="userActionsTrigger"]').click()
    cy.get('[data-testid="toggleAdminItem"]').should('contain', 'Revoke admin').click()
    userRow(MEMBER_EMAIL).should('not.contain', 'Admin')
  })

  it('redirects a signed-in non-admin away from the users section', () => {
    cy.loginAdmin(true) // onboarding@user.com — authenticated but not an admin

    cy.visit(`${ADMIN_URL}/users`)

    cy.get('[data-testid="usersPage"]').should('not.exist')
    cy.url().should('include', '/sign-in')
    cy.get('[data-testid="adminUnauthorizedCard"]').should('exist')
  })
})
