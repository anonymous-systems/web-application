/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

const NAME = 'E2E Technology'
const SLUG = 'e2e-technology'
const RENAMED = 'E2E Technology Renamed'
const RENAMED_SLUG = 'e2e-technology-renamed'

const technologyRow = (slug: string) =>
  cy.get(`[data-testid="technologyRow"][data-slug="${slug}"]`)

describe('Admin Technologies section', () => {
  beforeEach(() => {
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/technologies`)
  })

  it('renders the technologies section with an empty state', () => {
    cy.get('[data-testid="technologiesPage"]').should('exist')
    cy.get('[data-testid="technologiesTable"]').should('exist')
    cy.get('[data-testid="newTechnologyButton"]').should('exist')

    // Nothing is seeded, so the empty state is what should be showing.
    cy.get('[data-testid="technologiesEmpty"]')
      .should('be.visible')
      .and('contain', 'No technologies yet')
  })

  it('rejects a technology with no name', () => {
    cy.get('[data-testid="newTechnologyButton"]').click()
    cy.get('[data-testid="termFormDialog"]').should('be.visible')

    cy.get('[data-testid="termSubmit"]').click()

    cy.contains('Name is required').should('exist')
    // The dialog stays open so the mistake can be corrected.
    cy.get('[data-testid="termFormDialog"]').should('be.visible')
  })

  it('creates, edits, and deletes a technology', () => {
    // Create
    cy.get('[data-testid="newTechnologyButton"]').click()
    cy.get('[data-testid="termNameInput"]').type(NAME)
    cy.get('[data-testid="termDescriptionInput"]').type('Created by Cypress')
    cy.get('[data-testid="termSubmit"]').click()

    technologyRow(SLUG).should('contain', NAME).and('contain', SLUG)

    // Edit — the slug is regenerated from the new name
    technologyRow(SLUG).find('[data-testid="editTermTrigger"]').click()
    cy.get('[data-testid="termNameInput"]').clear()
    cy.get('[data-testid="termNameInput"]').type(RENAMED)
    cy.get('[data-testid="termSubmit"]').click()

    technologyRow(RENAMED_SLUG).should('contain', RENAMED)
    technologyRow(SLUG).should('not.exist')

    // Delete — restores the original state so the test is idempotent
    technologyRow(RENAMED_SLUG).find('[data-testid="deleteTermTrigger"]').click()
    cy.get('[data-testid="confirmDeleteTerm"]').click()

    technologyRow(RENAMED_SLUG).should('not.exist')
  })
})
