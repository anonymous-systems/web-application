/// <reference types="cypress" />

// The emulator honours `Authorization: Bearer owner` as a rules bypass, used to
// seed the fixtures and clear them afterwards.
const PROJECT = 'anonymous-systems-dev'
const BASE = 'http://127.0.0.1:8080/v1'
const DOCS = `${BASE}/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const TAG = { id: 'e2eChromeTag', name: 'Chrome Topic', slug: 'chrome-topic' }
const TAGGED = {
  id: 'e2eChromeStory',
  title: 'E2E Chrome Story',
  slug: 'e2e-chrome-story',
}
const UNTAGGED = {
  id: 'e2eChromeOther',
  title: 'E2E Chrome Other',
  slug: 'e2e-chrome-other',
}

const now = (): string => new Date().toISOString()
const tagPath = `projects/${PROJECT}/databases/(default)/documents/tags/${TAG.id}`

const seedTag = (): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/tags/${TAG.id}`,
    headers: OWNER,
    body: {
      fields: {
        name: { stringValue: TAG.name },
        slug: { stringValue: TAG.slug },
      },
    },
  })
}

const seedStory = (
  { id, title, slug }: { id: string; title: string; slug: string },
  tagged: boolean
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
        createdAt: { timestampValue: now() },
        publishedAt: { timestampValue: now() },
        tags: {
          arrayValue: {
            values: tagged ? [{ referenceValue: tagPath }] : [],
          },
        },
      },
    },
  })
}

const remove = (path: string): void => {
  cy.request({
    method: 'DELETE',
    url: `${DOCS}/${path}`,
    headers: OWNER,
    failOnStatusCode: false,
  })
}

describe('Site chrome', () => {
  before(() => {
    seedTag()
    seedStory(TAGGED, true)
    seedStory(UNTAGGED, false)
  })

  after(() => {
    ;[
      `stories/${TAGGED.id}`,
      `stories/${UNTAGGED.id}`,
      `tags/${TAG.id}`,
    ].forEach(remove)
  })

  describe('footer', () => {
    // The legal pages were previously reachable only from the onboarding
    // consent checkboxes, so a visitor who never signed up could not read them.
    it('links to the legal pages from any page', () => {
      cy.visit('/')

      cy.get('[data-testid="siteFooter"]')
        .find('a[href="/privacy-policy"]')
        .should('exist')
      cy.get('[data-testid="siteFooter"]')
        .find('a[href="/terms-and-conditions"]')
        .click()

      cy.url().should('include', '/terms-and-conditions')
    })
  })

  describe('command bar', () => {
    it('navigates without leaving the page it is on', () => {
      cy.visit('/')

      cy.get('[data-testid="commandBar"]').should('be.visible')
      // Selected by its visible label, which is also its accessible name — the
      // buttons carry text now rather than an aria-label standing in for one.
      cy.get('[data-testid="commandBar"]').contains('button', 'Stories').click()

      cy.url().should('include', '/stories')
      // Present on every page, not only the home page.
      cy.get('[data-testid="commandBar"]').should('be.visible')
    })

    // The current destination is marked for assistive tech, not by colour alone.
    it('marks the destination you are on', () => {
      cy.visit('/stories')

      cy.get('[data-testid="commandBar"]')
        .contains('button', 'Stories')
        .should('have.attr', 'aria-current', 'page')
      cy.get('[data-testid="commandBar"]')
        .contains('button', 'Portfolio')
        .should('not.have.attr', 'aria-current')
    })

    it('finds a story by title and jumps to it', () => {
      cy.visit('/')

      cy.get('[data-testid="commandBarSearch"]').click()
      cy.get('[cmdk-input]').type(TAGGED.title)
      cy.contains('[cmdk-item]', TAGGED.title).click()

      cy.url().should('include', `/stories/${TAGGED.slug}`)
    })
  })

  describe('home page', () => {
    it('leads to the content rather than to dead buttons', () => {
      cy.visit('/')

      // Asserted by href rather than visibility: the cards use a stretched
      // link, so the anchor itself has no size and Cypress reads it as hidden.
      cy.get(`a[href="/stories/${TAGGED.slug}"]`).should('exist')
      cy.get('[data-testid="heroPortfolioCta"]').click()
      cy.url().should('include', '/portfolio')
    })

    // The row this replaced was five hardcoded names matching nothing.
    it('filters the stories index from a topic chip', () => {
      cy.visit('/')

      cy.get(`[data-testid="homeTopics"] a[data-slug="${TAG.slug}"]`).click()

      cy.url().should('include', `tag=${TAG.slug}`)
      cy.get(`a[href="/stories/${TAGGED.slug}"]`).should('exist')
      cy.get(`a[href="/stories/${UNTAGGED.slug}"]`).should('not.exist')

      cy.get('[data-testid="clearTagFilter"]').click()
      cy.get(`a[href="/stories/${UNTAGGED.slug}"]`).should('exist')
    })
  })

  describe('not found', () => {
    it('offers a way back rather than a dead end', () => {
      cy.visit('/no-such-page', { failOnStatusCode: false })

      cy.get('[data-testid="notFoundPage"]').should('exist')
      cy.contains('a', 'Stories').should('exist')
    })
  })
})
