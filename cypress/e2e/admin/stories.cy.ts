/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

// The emulator honours `Authorization: Bearer owner` as a rules bypass, used to
// seed the list/delete fixture and to clear stories between tests.
const PROJECT = 'anonymous-systems-dev'
const BASE = 'http://127.0.0.1:8080/v1'
const DOCS = `${BASE}/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const STORY_ID = 'e2eStory'
const SEED_TITLE = 'E2E Seeded Story'
const CREATE_TITLE = 'E2E Alpha Story'
const EDIT_TITLE = 'E2E Beta Story'

const storyRow = () =>
  cy.get(`[data-testid="storyRow"][data-story-id="${STORY_ID}"]`)

const rowByTitle = (title: string) =>
  cy.contains('[data-testid="storyRow"]', title)

const now = () => new Date().toISOString()

const seedStory = (): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/stories/${STORY_ID}`,
    headers: OWNER,
    body: {
      fields: {
        title: { stringValue: SEED_TITLE },
        slug: { stringValue: 'e2e-seeded-story' },
        type: { stringValue: 'article' },
        status: { stringValue: 'published' },
        visibility: { stringValue: 'public' },
        createdAt: { timestampValue: now() },
        updatedAt: { timestampValue: now() },
      },
    },
  })
}

// Delete every story so each test starts from a known-empty collection.
const clearStories = (): void => {
  cy.request({
    method: 'GET',
    url: `${DOCS}/stories?pageSize=300`,
    headers: OWNER,
    failOnStatusCode: false,
  }).then((response) => {
    const documents: Array<{ name: string }> = response.body?.documents ?? []
    documents.forEach((doc) => {
      cy.request({
        method: 'DELETE',
        url: `${BASE}/${doc.name}`,
        headers: OWNER,
        failOnStatusCode: false,
      })
    })
  })
}

describe('Admin Stories section', () => {
  beforeEach(() => {
    clearStories()
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

  it('lists a seeded story and deletes it', () => {
    seedStory()
    cy.visit(`${ADMIN_URL}/stories`)

    storyRow().should('contain', SEED_TITLE).and('contain', 'published')

    storyRow().find('[data-testid="deleteStoryTrigger"]').click()
    cy.get('[data-testid="confirmDeleteStory"]').click()

    storyRow().should('not.exist')
    cy.get('[data-testid="storiesEmpty"]').should('be.visible')
  })

  it('creates, edits, and deletes a story through the form', () => {
    cy.visit(`${ADMIN_URL}/stories`)

    // Create
    cy.get('[data-testid="newStoryButton"]').click()
    cy.url().should('include', '/stories/new')
    cy.get('[data-testid="storyTitleInput"]').type(CREATE_TITLE)
    cy.get('[data-testid="storyTypeSelect"]').select('blog')
    cy.get('[data-testid="storyContentInput"]').type('Written in the admin form.')
    cy.get('[data-testid="storyPublish"]').click()

    cy.url().should('match', /\/stories$/)
    rowByTitle(CREATE_TITLE).should('exist')

    // Edit — the slug/title change round-trips through the edit page
    rowByTitle(CREATE_TITLE).find('[data-testid="editStoryTrigger"]').click()
    cy.url().should('include', '/edit')
    cy.get('[data-testid="storyTitleInput"]').should('have.value', CREATE_TITLE)
    cy.get('[data-testid="storyTitleInput"]').clear()
    cy.get('[data-testid="storyTitleInput"]').type(EDIT_TITLE)
    cy.get('[data-testid="storyPublish"]').click()

    cy.url().should('match', /\/stories$/)
    rowByTitle(EDIT_TITLE).should('exist')

    // Delete — restores the empty state so the test is idempotent
    rowByTitle(EDIT_TITLE).find('[data-testid="deleteStoryTrigger"]').click()
    cy.get('[data-testid="confirmDeleteStory"]').click()
    rowByTitle(EDIT_TITLE).should('not.exist')
  })
})
