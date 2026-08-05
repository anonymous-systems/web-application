/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

describe('Admin Overview dashboard', () => {
  beforeEach(() => {
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/`)
  })

  it('renders overview stat cards linking to each section', () => {
    cy.get('[data-testid="dashboardPage"]').should('exist')
    cy.get('[data-testid="overviewStats"]').should('exist')

    // One card per content type, each a numeric count linking to its section.
    cy.get('[data-testid="overviewStatCard"]').should('have.length', 6)
    cy.get('[data-testid="overviewStatCard"][data-stat="projects"]')
      .should('contain', 'Projects')
      .and('have.attr', 'href', '/projects')
  })
})
