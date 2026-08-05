/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

// Comments can't be authored from the admin UI, so fixtures are written straight
// into the Firestore emulator over its REST API. The emulator treats
// `Authorization: Bearer owner` as a full rules bypass.
const PROJECT = 'anonymous-systems-dev'
const DOCS = `http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const STORY_ID = 'e2eStory'
const COMMENT_ID = 'e2eComment'
const AUTHOR_ID = 'e2eCommentAuthor'
const AUTHOR = 'Ada Comment'
const STORY_TITLE = 'E2E Story'
const CONTENT = 'This is an E2E moderation comment.'

const PROJECT_ID = 'e2eCommentProject'
const PROJECT_COMMENT_ID = 'e2eProjectComment'
const PROJECT_TITLE = 'E2E Project'
const PROJECT_CONTENT = 'This is an E2E project comment.'

const commentRow = (id: string = COMMENT_ID) =>
  cy.get(`[data-testid="commentRow"][data-comment-id="${id}"]`)

const patchDoc = (path: string, fields: Record<string, unknown>) =>
  cy.request({ method: 'PATCH', url: `${DOCS}/${path}`, headers: OWNER, body: { fields } })

const deleteDoc = (path: string) =>
  cy.request({
    method: 'DELETE',
    url: `${DOCS}/${path}`,
    headers: OWNER,
    failOnStatusCode: false,
  })

const authorRef = `projects/${PROJECT}/databases/(default)/documents/users/${AUTHOR_ID}`

const seedAuthor = (): void => {
  patchDoc(`users/${AUTHOR_ID}`, {
    firstName: { stringValue: 'Ada' },
    lastName: { stringValue: 'Comment' },
    username: { stringValue: 'ada' },
  })
}

const seedComment = (): void => {
  seedAuthor()
  patchDoc(`stories/${STORY_ID}`, { title: { stringValue: STORY_TITLE } })
  patchDoc(`stories/${STORY_ID}/comments/${COMMENT_ID}`, {
    content: { stringValue: CONTENT },
    user: { referenceValue: authorRef },
    createdAt: { timestampValue: new Date().toISOString() },
  })
}

const seedProjectComment = (): void => {
  seedAuthor()
  patchDoc(`projects/${PROJECT_ID}`, { title: { stringValue: PROJECT_TITLE } })
  patchDoc(`projects/${PROJECT_ID}/comments/${PROJECT_COMMENT_ID}`, {
    content: { stringValue: PROJECT_CONTENT },
    user: { referenceValue: authorRef },
    createdAt: { timestampValue: new Date().toISOString() },
  })
}

const removeFixtures = (): void => {
  deleteDoc(`stories/${STORY_ID}/comments/${COMMENT_ID}`)
  deleteDoc(`stories/${STORY_ID}`)
  deleteDoc(`projects/${PROJECT_ID}/comments/${PROJECT_COMMENT_ID}`)
  deleteDoc(`projects/${PROJECT_ID}`)
  deleteDoc(`users/${AUTHOR_ID}`)
}

describe('Admin Comments section', () => {
  beforeEach(() => {
    // Start from a clean slate so a prior failed run can't leak fixtures.
    removeFixtures()
    cy.loginAdmin()
  })

  it('renders the comments section with an empty state', () => {
    cy.visit(`${ADMIN_URL}/comments`)

    cy.get('[data-testid="commentsPage"]').should('exist')
    cy.get('[data-testid="commentsTable"]').should('exist')

    // Nothing is seeded, so the empty state is what should be showing.
    cy.get('[data-testid="commentsEmpty"]')
      .should('be.visible')
      .and('contain', 'No comments yet')
  })

  it('lists a story comment and deletes it', () => {
    seedComment()
    cy.visit(`${ADMIN_URL}/comments`)

    commentRow()
      .should('have.attr', 'data-parent-type', 'story')
      .and('contain', CONTENT)
      .and('contain', AUTHOR)
      .and('contain', STORY_TITLE)

    // Delete — restores the empty state so the test is idempotent.
    commentRow().find('[data-testid="deleteCommentTrigger"]').click()
    cy.get('[data-testid="confirmDeleteComment"]').click()

    commentRow().should('not.exist')
    cy.get('[data-testid="commentsEmpty"]').should('be.visible')
  })

  it('lists a project comment and deletes it', () => {
    seedProjectComment()
    cy.visit(`${ADMIN_URL}/comments`)

    commentRow(PROJECT_COMMENT_ID)
      .should('have.attr', 'data-parent-type', 'project')
      .and('contain', PROJECT_CONTENT)
      .and('contain', AUTHOR)
      .and('contain', PROJECT_TITLE)

    // Deleting routes to the projects subcollection, not stories.
    commentRow(PROJECT_COMMENT_ID)
      .find('[data-testid="deleteCommentTrigger"]')
      .click()
    cy.get('[data-testid="confirmDeleteComment"]').click()

    commentRow(PROJECT_COMMENT_ID).should('not.exist')
    cy.get('[data-testid="commentsEmpty"]').should('be.visible')
  })
})
