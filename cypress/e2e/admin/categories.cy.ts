/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

const NAME = 'E2E Category'
const SLUG = 'e2e-category'
const RENAMED = 'E2E Category Renamed'
const RENAMED_SLUG = 'e2e-category-renamed'

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
    cy.get('[data-testid="categoryFormDialog"]').should('be.visible')

    cy.get('[data-testid="categorySubmit"]').click()

    cy.contains('Name is required').should('exist')
    // The dialog stays open so the mistake can be corrected.
    cy.get('[data-testid="categoryFormDialog"]').should('be.visible')
  })

  it('creates, edits, and deletes a category', () => {
    // Create
    cy.get('[data-testid="newCategoryButton"]').click()
    cy.get('[data-testid="categoryNameInput"]').type(NAME)
    cy.get('[data-testid="categoryDescriptionInput"]').type('Created by Cypress')
    cy.get('[data-testid="categorySubmit"]').click()

    categoryRow(SLUG).should('contain', NAME).and('contain', SLUG)

    // Edit — the slug is regenerated from the new name
    categoryRow(SLUG).find('[data-testid="editCategoryTrigger"]').click()
    cy.get('[data-testid="categoryNameInput"]').clear()
    cy.get('[data-testid="categoryNameInput"]').type(RENAMED)
    cy.get('[data-testid="categorySubmit"]').click()

    categoryRow(RENAMED_SLUG).should('contain', RENAMED)
    categoryRow(SLUG).should('not.exist')

    // Delete — restores the original state so the test is idempotent
    categoryRow(RENAMED_SLUG).find('[data-testid="deleteCategoryTrigger"]').click()
    cy.get('[data-testid="confirmDeleteCategory"]').click()

    categoryRow(RENAMED_SLUG).should('not.exist')
  })
})
