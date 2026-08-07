/// <reference types="cypress" />

// The emulator honours `Authorization: Bearer owner` as a rules bypass, used to
// seed parents and comments and to clear them between tests.
const PROJECT = 'anonymous-systems-dev'
const BASE = 'http://127.0.0.1:8080/v1'
const DOCS = `${BASE}/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const STORY = {
  id: 'e2eCommentStory',
  title: 'E2E Commentable Story',
  slug: 'e2e-commentable-story',
}
const CLOSED = {
  id: 'e2eClosedStory',
  title: 'E2E Closed Story',
  slug: 'e2e-closed-story',
}

const now = (): string => new Date().toISOString()

const seedStory = (
  { id, title, slug }: { id: string; title: string; slug: string },
  allowComments: boolean
): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/stories/${id}`,
    headers: OWNER,
    body: {
      fields: {
        title: { stringValue: title },
        slug: { stringValue: slug },
        type: { stringValue: 'article' },
        status: { stringValue: 'published' },
        visibility: { stringValue: 'public' },
        allowComments: { booleanValue: allowComments },
        createdAt: { timestampValue: now() },
        publishedAt: { timestampValue: now() },
      },
    },
  })
}

const seedComment = (storyId: string, content: string): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/stories/${storyId}/comments/seeded`,
    headers: OWNER,
    body: {
      fields: {
        content: { stringValue: content },
        createdAt: { timestampValue: now() },
      },
    },
  })
}

const clearStories = (): void => {
  cy.request({
    method: 'GET',
    url: `${DOCS}/stories?pageSize=300`,
    headers: OWNER,
    failOnStatusCode: false,
  }).then((response) => {
    const documents: Array<{ name: string }> = response.body?.documents ?? []
    documents.forEach((document) => {
      // Comments are a subcollection, so they must go before their parent.
      cy.request({
        method: 'GET',
        url: `${BASE}/${document.name}/comments?pageSize=100`,
        headers: OWNER,
        failOnStatusCode: false,
      }).then((comments) => {
        const found: Array<{ name: string }> = comments.body?.documents ?? []
        found.forEach((comment) => {
          cy.request({
            method: 'DELETE',
            url: `${BASE}/${comment.name}`,
            headers: OWNER,
            failOnStatusCode: false,
          })
        })
      })

      cy.request({
        method: 'DELETE',
        url: `${BASE}/${document.name}`,
        headers: OWNER,
        failOnStatusCode: false,
      })
    })
  })
}

describe('Comments', () => {
  beforeEach(() => {
    clearStories()
    seedStory(STORY, true)
  })

  after(() => clearStories())

  describe('when signed out', () => {
    beforeEach(() => cy.logout())

    it('reads the thread and is prompted to sign in', () => {
      seedComment(STORY.id, 'A seeded comment')

      cy.visit(`/stories/${STORY.slug}`)
      cy.get('[data-testid="commentsSection"]').should('exist')
      cy.contains('A seeded comment').should('be.visible')
      cy.contains('Sign in to join the conversation.').should('be.visible')
    })

    it('counts the thread', () => {
      seedComment(STORY.id, 'A seeded comment')

      cy.visit(`/stories/${STORY.slug}`)
      cy.contains('1 Comment').should('be.visible')
    })

    it('shows an empty thread with no comments', () => {
      cy.visit(`/stories/${STORY.slug}`)
      cy.contains('0 Comments').should('be.visible')
    })
  })

  describe('when signed in', () => {
    beforeEach(() => cy.login())

    it('posts a comment and shows it in the thread', () => {
      cy.visit(`/stories/${STORY.slug}`)

      cy.get('textarea[aria-label="Add a comment"]').type('Posted from Cypress')
      cy.contains('button', 'Comment').click()

      cy.contains('Posted from Cypress').should('be.visible')
      cy.contains('1 Comment').should('be.visible')
    })

    // The composer stays a single line until engaged, so an untouched thread
    // isn't dominated by a form.
    it('only offers actions once the composer is focused', () => {
      cy.visit(`/stories/${STORY.slug}`)

      cy.contains('button', 'Comment').should('not.exist')
      cy.get('textarea[aria-label="Add a comment"]').focus()
      cy.contains('button', 'Comment').should('be.visible')
      cy.contains('button', 'Cancel').should('be.visible')
    })

    it('clears the composer on cancel', () => {
      cy.visit(`/stories/${STORY.slug}`)

      cy.get('textarea[aria-label="Add a comment"]').type('Never mind')
      cy.contains('button', 'Cancel').click()

      cy.get('textarea[aria-label="Add a comment"]').should('have.value', '')
    })
  })

  // Says so rather than vanishing: a missing section is ambiguous, since a
  // reader cannot tell a closed thread from one that failed to load.
  it('says comments are turned off rather than hiding the section', () => {
    seedStory(CLOSED, false)

    cy.visit(`/stories/${CLOSED.slug}`)
    cy.get('[data-testid="storyDetailPage"]').should('exist')
    cy.get('[data-testid="commentsSection"]').should('exist')
    cy.contains('Comments are turned off.').should('be.visible')
  })

  it('offers no composer or thread when comments are turned off', () => {
    seedStory(CLOSED, false)

    cy.visit(`/stories/${CLOSED.slug}`)
    cy.get('[data-testid="commentsDisabled"]').should('exist')
    cy.get('textarea[aria-label="Add a comment"]').should('not.exist')
    cy.contains('Sign in to join the conversation.').should('not.exist')
  })
})
