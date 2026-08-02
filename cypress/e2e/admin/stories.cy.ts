/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

// Stories are authored through a form (built in a later phase), so the list/delete
// UI is exercised here against a story written straight into the Firestore
// emulator. `Authorization: Bearer owner` bypasses the security rules.
const PROJECT = 'anonymous-systems-dev'
const DOCS = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const STORY_ID = 'e2eStory'
const TITLE = 'E2E Story'

const storyRow = () =>
  cy.get(`[data-testid="storyRow"][data-story-id="${STORY_ID}"]`)

const now = () => new Date().toISOString()

const seedStory = (): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/stories/${STORY_ID}`,
    headers: OWNER,
    body: {
      fields: {
        title: { stringValue: TITLE },
        slug: { stringValue: 'e2e-story' },
        type: { stringValue: 'article' },
        status: { stringValue: 'published' },
        visibility: { stringValue: 'public' },
        createdAt: { timestampValue: now() },
        updatedAt: { timestampValue: now() },
      },
    },
  })
}

const removeStory = (): void => {
  cy.request({
    method: 'DELETE',
    url: `${DOCS}/stories/${STORY_ID}`,
    headers: OWNER,
    failOnStatusCode: false,
  })
}

describe('Admin Stories section', () => {
  beforeEach(() => {
    // Start clean so a prior failed run can't leak the fixture.
    removeStory()
    cy.loginAdmin()
  })

  it('renders the stories section with an empty state', () => {
    cy.visit(`${ADMIN_URL}/stories`)

    cy.get('[data-testid="storiesPage"]').should('exist')
    cy.get('[data-testid="storiesTable"]').should('exist')
    cy.get('[data-testid="newStoryButton"]').should('exist')

    cy.get('[data-testid="storiesEmpty"]')
      .should('be.visible')
      .and('contain', 'No stories yet')
  })

  it('lists a story and deletes it', () => {
    seedStory()
    cy.visit(`${ADMIN_URL}/stories`)

    storyRow().should('contain', TITLE).and('contain', 'published')

    // Delete — restores the empty state so the test is idempotent.
    storyRow().find('[data-testid="deleteStoryTrigger"]').click()
    cy.get('[data-testid="confirmDeleteStory"]').click()

    storyRow().should('not.exist')
    cy.get('[data-testid="storiesEmpty"]').should('be.visible')
  })
})
