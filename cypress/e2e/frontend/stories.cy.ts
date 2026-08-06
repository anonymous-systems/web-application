/// <reference types="cypress" />

// The emulator honours `Authorization: Bearer owner` as a rules bypass, used to
// seed the fixtures and to clear stories between tests.
const PROJECT = 'anonymous-systems-dev'
const BASE = 'http://127.0.0.1:8080/v1'
const DOCS = `${BASE}/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const PUBLISHED = {
  id: 'e2ePublicStory',
  title: 'E2E Published Story',
  slug: 'e2e-published-story',
}
const DRAFT = { id: 'e2eDraftStory', title: 'E2E Draft Story' }
const PRIVATE = { id: 'e2ePrivateStory', title: 'E2E Private Story' }

const now = (): string => new Date().toISOString()

interface SeedOptions {
  id: string
  title: string
  slug?: string
  type?: string
  status?: string
  visibility?: string
}

const seedStory = ({
  id,
  title,
  slug = id.toLowerCase(),
  type = 'article',
  status = 'published',
  visibility = 'public',
}: SeedOptions): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/stories/${id}`,
    headers: OWNER,
    body: {
      fields: {
        title: { stringValue: title },
        slug: { stringValue: slug },
        type: { stringValue: type },
        status: { stringValue: status },
        visibility: { stringValue: visibility },
        excerpt: { stringValue: `${title} excerpt` },
        readTimeMinutes: { integerValue: '4' },
        createdAt: { timestampValue: now() },
        publishedAt: { timestampValue: now() },
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

describe('Stories', () => {
  beforeEach(() => {
    clearStories()
    seedStory(PUBLISHED)
  })

  after(() => clearStories())

  it('lists a published, public story', () => {
    cy.visit('/stories')
    cy.get('[data-testid="storiesPage"]').should('exist')
    cy.contains(PUBLISHED.title).should('be.visible')
  })

  // The public site reads through publiclyVisible(), which filters at query
  // level — draft and private documents must never reach the page.
  it('hides drafts and private stories', () => {
    seedStory({ ...DRAFT, status: 'draft' })
    seedStory({ ...PRIVATE, visibility: 'private' })

    cy.visit('/stories')
    cy.contains(PUBLISHED.title).should('be.visible')
    cy.contains(DRAFT.title).should('not.exist')
    cy.contains(PRIVATE.title).should('not.exist')
  })

  it('filters by story type and back to all', () => {
    seedStory({ id: 'e2eSnippet', title: 'E2E Snippet Story', type: 'snippet' })

    cy.visit('/stories?type=snippet')
    cy.contains('E2E Snippet Story').should('be.visible')
    cy.contains(PUBLISHED.title).should('not.exist')

    // ALL_FILTER drops the query parameter rather than filtering on ''.
    cy.visit('/stories')
    cy.contains(PUBLISHED.title).should('be.visible')
    cy.contains('E2E Snippet Story').should('be.visible')
  })

  it('falls back to all stories for an unknown filter value', () => {
    cy.visit('/stories?type=not-a-type')
    cy.contains(PUBLISHED.title).should('be.visible')
  })

  it('opens the detail page from a card', () => {
    cy.visit('/stories')
    cy.contains(PUBLISHED.title).click()

    cy.location('pathname').should('eq', `/stories/${PUBLISHED.slug}`)
    cy.get('[data-testid="storyDetailPage"]').should('exist')
    cy.contains(PUBLISHED.title).should('be.visible')
  })

  it('sets a per-story title', () => {
    cy.visit(`/stories/${PUBLISHED.slug}`)
    cy.title().should('eq', `${PUBLISHED.title} | Anonymous Systems`)
  })

  // A missing story must be a 404, not a 200 rendering the not-found body: a
  // `loading.tsx` on the /stories segment used to stream the shell first, which
  // committed a 200 before notFound() could set the status.
  it('returns 404 for an unknown slug', () => {
    cy.request({
      url: '/stories/no-such-story',
      failOnStatusCode: false,
    }).its('status').should('eq', 404)
  })

  it('returns 404 for a story that is not published', () => {
    seedStory({ ...DRAFT, slug: 'e2e-draft-story', status: 'draft' })

    cy.request({
      url: '/stories/e2e-draft-story',
      failOnStatusCode: false,
    }).its('status').should('eq', 404)
  })
})
