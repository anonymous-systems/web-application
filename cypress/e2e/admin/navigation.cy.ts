/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

// The sidebar is only an off-canvas sheet below its 768px breakpoint.
const mobileSidebar = () => cy.get('[data-slot="sidebar"][data-mobile="true"]')

describe('Admin sidebar navigation (mobile)', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/`)
  })

  it('closes the sidebar after a nav item is clicked', () => {
    // The nav lives inside the sheet on mobile, so open it first.
    cy.get('[data-slot="sidebar-trigger"]').click()
    mobileSidebar().should('be.visible').contains('a', 'Categories').click()

    cy.url().should('include', '/categories')
    cy.get('[data-testid="categoriesPage"]').should('exist')

    // The sheet must not stay open over the page it navigated to.
    mobileSidebar().should('not.exist')
  })
})
