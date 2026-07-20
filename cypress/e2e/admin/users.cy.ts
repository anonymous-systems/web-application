/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')
const ADMIN_EMAIL = 'cypress@user.com'
const MEMBER_EMAIL = 'onboarding@user.com'

const userRow = (email: string) =>
  cy.get(`[data-testid="userRow"][data-email="${email}"]`)

// The trigger is disabled while a toggle is in flight, so wait for it to settle
// before opening the menu — otherwise the click lands on a disabled button.
const openRowActions = (email: string) =>
  userRow(email)
    .find('[data-testid="userActionsTrigger"]')
    .should('not.be.disabled')
    .click()

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

    openRowActions(ADMIN_EMAIL)
    cy.get('[data-testid="toggleAdminItem"]').should('have.attr', 'data-disabled')
  })

  // Runs before the grant/revoke test so it never depends on that test's cleanup.
  it('redirects a signed-in non-admin away from the users section', () => {
    cy.loginAdmin(true) // onboarding@user.com — authenticated but not an admin

    cy.visit(`${ADMIN_URL}/users`)

    cy.get('[data-testid="usersPage"]').should('not.exist')
    cy.url().should('include', '/sign-in')
    cy.get('[data-testid="adminUnauthorizedCard"]').should('exist')
  })

  it('grants and revokes admin access for another user', () => {
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/users`)

    userRow(MEMBER_EMAIL).should('not.contain', 'Admin')

    // Grant
    openRowActions(MEMBER_EMAIL)
    cy.get('[data-testid="toggleAdminItem"]').should('contain', 'Grant admin').click()
    userRow(MEMBER_EMAIL).should('contain', 'Admin')

    // Reload before the next interaction: it proves the claim actually persisted
    // server-side, and avoids clicking into a row that is still re-rendering
    // from the action's revalidation.
    cy.reload()
    userRow(MEMBER_EMAIL).should('contain', 'Admin')

    // Revoke — restores the original state so the test is idempotent
    openRowActions(MEMBER_EMAIL)
    cy.get('[data-testid="toggleAdminItem"]').should('contain', 'Revoke admin').click()
    userRow(MEMBER_EMAIL).should('not.contain', 'Admin')
  })
})
