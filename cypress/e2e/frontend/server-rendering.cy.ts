/// <reference types="cypress" />

// The emulator honours `Authorization: Bearer owner` as a rules bypass, used to
// seed the fixture and clear it afterwards.
const PROJECT = 'anonymous-systems-dev'
const BASE = 'http://127.0.0.1:8080/v1'
const DOCS = `${BASE}/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const STORY = {
  id: 'e2eSsrStory',
  title: 'E2E Server Rendered Story',
  slug: 'e2e-server-rendered-story',
  excerpt: 'This sentence must appear in the raw HTML, not only after hydration.',
}

const now = (): string => new Date().toISOString()

const seedStory = (): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/stories/${STORY.id}`,
    headers: OWNER,
    body: {
      fields: {
        title: { stringValue: STORY.title },
        slug: { stringValue: STORY.slug },
        excerpt: { stringValue: STORY.excerpt },
        type: { stringValue: 'article' },
        status: { stringValue: 'published' },
        visibility: { stringValue: 'public' },
        createdAt: { timestampValue: now() },
        publishedAt: { timestampValue: now() },
      },
    },
  })
}

/**
 * Just the rendered body: `<head>` dropped, then scripts stripped.
 *
 * Both removals are load-bearing, and each was found by watching this spec pass
 * when it should not have. `<head>` carries the title and description as
 * metadata, so asserting a story's title against the whole document succeeds on
 * a page that renders nothing. Scripts carry Next's RSC payload, which contains
 * the same text again for the same reason.
 *
 * What is left is what a reader without JavaScript actually sees.
 */
const renderedBody = (document: string): string => {
  const body = document.split('<body')[1] ?? ''

  return body.replace(/<script[\s\S]*?<\/script>/g, '')
}

/**
 * What a crawler sees.
 *
 * `cy.request` issues a plain HTTP request with no JavaScript, unlike
 * `cy.visit`, which runs a browser and hydrates the page before any assertion.
 * That difference is why a client-only render passed every other spec in this
 * suite: to `cy.visit` the two are indistinguishable.
 */
const requestBody = (path: string): Cypress.Chainable<string> =>
  cy.request(path).then((response) => renderedBody(response.body as string))

describe('Server rendering', () => {
  before(() => seedStory())

  after(() => {
    cy.request({
      method: 'DELETE',
      url: `${DOCS}/stories/${STORY.id}`,
      headers: OWNER,
      failOnStatusCode: false,
    })
  })

  it('renders the story on the server', () => {
    requestBody(`/stories/${STORY.slug}`).should((body) => {
      expect(body).to.include(STORY.title)
      expect(body).to.include(STORY.excerpt)
    })
  })

  it('renders the stories index on the server', () => {
    requestBody('/stories').should((body) => {
      expect(body).to.include('Our Stories')
      expect(body).to.include(STORY.title)
    })
  })

  it('renders the home page on the server', () => {
    requestBody('/').should((body) =>
      expect(body).to.include('Technology that moves your business forward')
    )
  })

  it('renders the portfolio index on the server', () => {
    // Asserting the heading rather than the word "Portfolio", which also
    // appears in the <title> and so would pass on an empty body.
    requestBody('/portfolio').should('include', 'Discover Our Work')
  })
})
