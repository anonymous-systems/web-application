/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

const NAME = 'E2E Category'
const SLUG = 'e2e-category'
const RENAMED = 'E2E Category Renamed'

const categoryRow = (slug: string) =>
  cy.get(`[data-testid="categoryRow"][data-slug="${slug}"]`)

describe('Admin Categories section', () => {
  beforeEach(() => {
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/categories`)
  })

  it('renders the categories section with an empty state', () => {
    cy.get('[data-testid="categoriesPage"]').should('exist')
    cy.get('[data-testid="categoriesTable"]').should('exist')
    cy.get('[data-testid="newCategoryButton"]').should('exist')

    // Nothing is seeded, so the empty state is what should be showing.
    cy.get('[data-testid="categoriesEmpty"]')
      .should('be.visible')
      .and('contain', 'No categories yet')
  })

  it('rejects a category with no name', () => {
    cy.get('[data-testid="newCategoryButton"]').click()
    cy.get('[data-testid="termFormDialog"]').should('be.visible')

    cy.get('[data-testid="termSubmit"]').click()

    cy.contains('Name is required').should('exist')
    // The dialog stays open so the mistake can be corrected.
    cy.get('[data-testid="termFormDialog"]').should('be.visible')
  })

  it('creates, edits, and deletes a category', () => {
    // Create
    cy.get('[data-testid="newCategoryButton"]').click()
    cy.get('[data-testid="termNameInput"]').type(NAME)
    cy.get('[data-testid="termDescriptionInput"]').type('Created by Cypress')
    cy.get('[data-testid="termSubmit"]').click()

    categoryRow(SLUG).should('contain', NAME).and('contain', SLUG)

    // Edit — a rename must not move the slug: it is the term's public identity,
    // and re-deriving it would break every URL already pointing at the term.
    categoryRow(SLUG).find('[data-testid="editTermTrigger"]').click()
    cy.get('[data-testid="termNameInput"]').clear()
    cy.get('[data-testid="termNameInput"]').type(RENAMED)
    cy.get('[data-testid="termSubmit"]').click()

    categoryRow(SLUG).should('contain', RENAMED).and('contain', SLUG)

    // Delete — restores the original state so the test is idempotent
    categoryRow(SLUG).find('[data-testid="deleteTermTrigger"]').click()
    cy.get('[data-testid="confirmDeleteTerm"]').click()

    categoryRow(SLUG).should('not.exist')
  })
})
