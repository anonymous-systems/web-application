/// <reference types="cypress" />

// The emulator honours `Authorization: Bearer owner` as a rules bypass, used to
// seed the fixtures and clear them afterwards.
const PROJECT = 'anonymous-systems-dev'
const BASE = 'http://127.0.0.1:8080/v1'
const DOCS = `${BASE}/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const AUTHOR = {
  uid: 'e2eProfileAuthor',
  username: 'e2e-author',
  firstName: 'Ada',
  lastName: 'Author',
}
const PUBLISHED = {
  id: 'e2eProfileStory',
  title: 'E2E Profile Story',
  slug: 'e2e-profile-story',
}
const DRAFT = { id: 'e2eProfileDraft', title: 'E2E Profile Draft' }
const OTHERS = {
  id: 'e2eOtherAuthorStory',
  title: 'E2E Other Author Story',
  slug: 'e2e-other-author-story',
}

const now = (): string => new Date().toISOString()
const userPath = (uid: string): string =>
  `projects/${PROJECT}/databases/(default)/documents/users/${uid}`

const seedAuthor = (): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/users/${AUTHOR.uid}`,
    headers: OWNER,
    body: {
      fields: {
        firstName: { stringValue: AUTHOR.firstName },
        lastName: { stringValue: AUTHOR.lastName },
        username: { stringValue: AUTHOR.username },
      },
    },
  })
  // The username -> uid index the onboarding function maintains; the profile
  // page resolves through it rather than querying the users collection.
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/usernames/${AUTHOR.username}`,
    headers: OWNER,
    body: { fields: { userId: { stringValue: AUTHOR.uid } } },
  })
}

const seedStory = (
  { id, title, slug }: { id: string; title: string; slug?: string },
  { uid, status }: { uid: string; status: string }
): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/stories/${id}`,
    headers: OWNER,
    body: {
      fields: {
        title: { stringValue: title },
        slug: { stringValue: slug ?? id.toLowerCase() },
        type: { stringValue: 'article' },
        status: { stringValue: status },
        visibility: { stringValue: 'public' },
        user: { referenceValue: userPath(uid) },
        createdAt: { timestampValue: now() },
        publishedAt: { timestampValue: now() },
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

describe('Public profile', () => {
  before(() => {
    seedAuthor()
    seedStory(PUBLISHED, { uid: AUTHOR.uid, status: 'published' })
    seedStory(DRAFT, { uid: AUTHOR.uid, status: 'draft' })
    seedStory(OTHERS, { uid: 'someoneElse', status: 'published' })
  })

  after(() => {
    ;[
      `stories/${PUBLISHED.id}`,
      `stories/${DRAFT.id}`,
      `stories/${OTHERS.id}`,
      `users/${AUTHOR.uid}`,
      `usernames/${AUTHOR.username}`,
    ].forEach(remove)
  })

  it('shows the author and only their published work', () => {
    cy.visit(`/u/${AUTHOR.username}`)

    cy.get('[data-testid="publicProfilePage"]').should('exist')
    cy.contains(`${AUTHOR.firstName} ${AUTHOR.lastName}`).should('be.visible')
    cy.get('[data-testid="profileUsername"]').should(
      'contain.text',
      AUTHOR.username
    )

    cy.get(`a[href="/stories/${PUBLISHED.slug}"]`).should('exist')
    // A draft is not published, and another author's story is not theirs.
    cy.contains(DRAFT.title).should('not.exist')
    cy.get(`a[href="/stories/${OTHERS.slug}"]`).should('not.exist')
  })

  // The page is public, so it has to reach a crawler without JavaScript — the
  // same check that caught the whole app rendering client-side only.
  it('renders on the server', () => {
    cy.request(`/u/${AUTHOR.username}`).then((response) => {
      const body = (response.body as string).split('<body')[1] ?? ''
      const markup = body.replace(/<script[\s\S]*?<\/script>/g, '')

      expect(markup).to.include(`${AUTHOR.firstName} ${AUTHOR.lastName}`)
      expect(markup).to.include(PUBLISHED.title)
    })
  })

  it('reaches the profile from a story byline', () => {
    cy.visit(`/stories/${PUBLISHED.slug}`)

    cy.get('[data-testid="authorProfileLink"]').click()

    cy.url().should('include', `/u/${AUTHOR.username}`)
    cy.get('[data-testid="publicProfilePage"]').should('exist')
  })

  // A username nobody holds is a missing page, not an empty profile — and it
  // must be a real 404 so it is not indexed as a thin page.
  it('returns 404 for an unknown username', () => {
    cy.request({ url: '/u/nobody-has-this', failOnStatusCode: false })
      .its('status')
      .should('eq', 404)
  })
})
