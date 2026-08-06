/// <reference types="cypress" />

// The emulator honours `Authorization: Bearer owner` as a rules bypass, used to
// seed the fixtures and to clear projects between tests.
const PROJECT = 'anonymous-systems-dev'
const BASE = 'http://127.0.0.1:8080/v1'
const DOCS = `${BASE}/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const PUBLISHED = {
  id: 'e2ePublicProject',
  title: 'E2E Published Project',
  slug: 'e2e-published-project',
}
const DRAFT = { id: 'e2eDraftProject', title: 'E2E Draft Project' }
const PRIVATE = { id: 'e2ePrivateProject', title: 'E2E Private Project' }

const now = (): string => new Date().toISOString()

interface SeedOptions {
  id: string
  title: string
  slug?: string
  status?: string
  visibility?: string
  developmentStatus?: string
  technologies?: string[]
}

const seedProject = ({
  id,
  title,
  slug = id.toLowerCase(),
  status = 'published',
  visibility = 'public',
  developmentStatus = 'complete',
  technologies = ['Angular'],
}: SeedOptions): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/projects/${id}`,
    headers: OWNER,
    body: {
      fields: {
        title: { stringValue: title },
        slug: { stringValue: slug },
        status: { stringValue: status },
        visibility: { stringValue: visibility },
        developmentStatus: { stringValue: developmentStatus },
        excerpt: { stringValue: `${title} excerpt` },
        technologies: {
          arrayValue: {
            values: technologies.map((value) => ({ stringValue: value })),
          },
        },
        createdAt: { timestampValue: now() },
        publishedAt: { timestampValue: now() },
      },
    },
  })
}

const clearProjects = (): void => {
  cy.request({
    method: 'GET',
    url: `${DOCS}/projects?pageSize=300`,
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

describe('Portfolio', () => {
  beforeEach(() => {
    clearProjects()
    seedProject(PUBLISHED)
  })

  after(() => clearProjects())

  it('lists a published, public project', () => {
    cy.visit('/portfolio')
    cy.get('[data-testid="portfolioPage"]').should('exist')
    cy.contains(PUBLISHED.title).should('be.visible')
  })

  it('hides drafts and private projects', () => {
    seedProject({ ...DRAFT, status: 'draft' })
    seedProject({ ...PRIVATE, visibility: 'private' })

    cy.visit('/portfolio')
    cy.contains(PUBLISHED.title).should('be.visible')
    cy.contains(DRAFT.title).should('not.exist')
    cy.contains(PRIVATE.title).should('not.exist')
  })

  // The technology chips are what distinguish a project card from a story card,
  // so their absence would quietly undo the differentiation.
  it('shows the development status and technology chips on a card', () => {
    cy.visit('/portfolio')
    cy.contains('Complete').should('be.visible')
    cy.contains('Angular').should('be.visible')
  })

  it('filters by development status and back to all', () => {
    seedProject({
      id: 'e2ePlannedProject',
      title: 'E2E Planned Project',
      developmentStatus: 'planned',
    })

    cy.visit('/portfolio?status=planned')
    cy.contains('E2E Planned Project').should('be.visible')
    cy.contains(PUBLISHED.title).should('not.exist')

    cy.visit('/portfolio')
    cy.contains(PUBLISHED.title).should('be.visible')
    cy.contains('E2E Planned Project').should('be.visible')
  })

  it('opens the detail page from a card', () => {
    cy.visit('/portfolio')
    cy.contains(PUBLISHED.title).click()

    cy.location('pathname').should('eq', `/portfolio/${PUBLISHED.slug}`)
    cy.get('[data-testid="projectDetailPage"]').should('exist')
  })

  it('returns 404 for an unknown slug', () => {
    cy.request({
      url: '/portfolio/no-such-project',
      failOnStatusCode: false,
    }).its('status').should('eq', 404)
  })
})
