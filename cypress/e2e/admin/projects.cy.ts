/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

// The emulator honours `Authorization: Bearer owner` as a rules bypass, used to
// seed the list/delete fixture and to clear projects between tests.
const PROJECT = 'anonymous-systems-dev'
const BASE = 'http://127.0.0.1:8080/v1'
const DOCS = `${BASE}/projects/${PROJECT}/databases/(default)/documents`
const OWNER = { Authorization: 'Bearer owner' }

const PROJECT_ID = 'e2eProject'
const SEED_TITLE = 'E2E Seeded Project'

const projectRow = () =>
  cy.get(`[data-testid="projectRow"][data-project-id="${PROJECT_ID}"]`)

const now = (): string => new Date().toISOString()

const seedProject = (): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/projects/${PROJECT_ID}`,
    headers: OWNER,
    body: {
      fields: {
        title: { stringValue: SEED_TITLE },
        slug: { stringValue: 'e2e-seeded-project' },
        status: { stringValue: 'published' },
        visibility: { stringValue: 'public' },
        developmentStatus: { stringValue: 'in-development' },
        createdAt: { timestampValue: now() },
        updatedAt: { timestampValue: now() },
      },
    },
  })
}

// Delete every project so each test starts from a known-empty collection.
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

describe('Admin Portfolio section', () => {
  beforeEach(() => {
    clearProjects()
    cy.loginAdmin()
  })

  it('renders the portfolio section with an empty state', () => {
    cy.visit(`${ADMIN_URL}/projects`)

    cy.get('[data-testid="projectsPage"]').should('exist')
    cy.get('[data-testid="projectsTable"]').should('exist')
    cy.get('[data-testid="newProjectButton"]').should('exist')

    cy.get('[data-testid="projectsEmpty"]')
      .should('be.visible')
      .and('contain', 'No projects yet')
  })

  it('lists a seeded project with its status and development stage', () => {
    seedProject()
    cy.visit(`${ADMIN_URL}/projects`)

    projectRow()
      .should('contain', SEED_TITLE)
      .and('contain', 'published')
      .and('contain', 'In development')
  })

  it('deletes a seeded project', () => {
    seedProject()
    cy.visit(`${ADMIN_URL}/projects`)

    projectRow().find('[data-testid="deleteProjectTrigger"]').click()
    cy.get('[data-testid="confirmDeleteProject"]').click()

    projectRow().should('not.exist')
    cy.get('[data-testid="projectsEmpty"]').should('be.visible')
  })
})
