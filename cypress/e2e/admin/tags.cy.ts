/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

const NAME = 'E2E Tag'
const SLUG = 'e2e-tag'
const RENAMED = 'E2E Tag Renamed'

const tagRow = (slug: string) =>
  cy.get(`[data-testid="tagRow"][data-slug="${slug}"]`)

describe('Admin Tags section', () => {
  beforeEach(() => {
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/tags`)
  })

  it('renders the tags section with an empty state', () => {
    cy.get('[data-testid="tagsPage"]').should('exist')
    cy.get('[data-testid="tagsTable"]').should('exist')
    cy.get('[data-testid="newTagButton"]').should('exist')

    // Nothing is seeded, so the empty state is what should be showing.
    cy.get('[data-testid="tagsEmpty"]')
      .should('be.visible')
      .and('contain', 'No tags yet')
  })

  it('rejects a tag with no name', () => {
    cy.get('[data-testid="newTagButton"]').click()
    cy.get('[data-testid="termFormDialog"]').should('be.visible')

    cy.get('[data-testid="termSubmit"]').click()

    cy.contains('Name is required').should('exist')
    // The dialog stays open so the mistake can be corrected.
    cy.get('[data-testid="termFormDialog"]').should('be.visible')
  })

  it('creates, edits, and deletes a tag', () => {
    // Create
    cy.get('[data-testid="newTagButton"]').click()
    cy.get('[data-testid="termNameInput"]').type(NAME)
    cy.get('[data-testid="termDescriptionInput"]').type('Created by Cypress')
    cy.get('[data-testid="termSubmit"]').click()

    tagRow(SLUG).should('contain', NAME).and('contain', SLUG)

    // Edit — a rename must not move the slug: it is the term's public identity,
    // and re-deriving it would break every URL already pointing at the term.
    tagRow(SLUG).find('[data-testid="editTermTrigger"]').click()
    cy.get('[data-testid="termNameInput"]').clear()
    cy.get('[data-testid="termNameInput"]').type(RENAMED)
    cy.get('[data-testid="termSubmit"]').click()

    tagRow(SLUG).should('contain', RENAMED).and('contain', SLUG)

    // Delete — restores the original state so the test is idempotent
    tagRow(SLUG).find('[data-testid="deleteTermTrigger"]').click()
    cy.get('[data-testid="confirmDeleteTerm"]').click()

    tagRow(SLUG).should('not.exist')
  })
})
