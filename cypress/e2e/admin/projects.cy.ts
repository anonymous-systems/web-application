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
const CREATE_TITLE = 'E2E Alpha Project'
const EDIT_TITLE = 'E2E Beta Project'

const TECH_ID = 'e2eProjectTech'
const TECH_SLUG = 'react'
const TAG_ID = 'e2eProjectTag'
const TAG_SLUG = 'web'

const projectRow = () =>
  cy.get(`[data-testid="projectRow"][data-project-id="${PROJECT_ID}"]`)

const rowByTitle = (title: string) =>
  cy.contains('[data-testid="projectRow"]', title)

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

// A technology + tag the form can offer as chips to select.
const seedTerms = (): void => {
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/technologies/${TECH_ID}`,
    headers: OWNER,
    body: {
      fields: { name: { stringValue: 'React' }, slug: { stringValue: TECH_SLUG } },
    },
  })
  cy.request({
    method: 'PATCH',
    url: `${DOCS}/tags/${TAG_ID}`,
    headers: OWNER,
    body: {
      fields: { name: { stringValue: 'Web' }, slug: { stringValue: TAG_SLUG } },
    },
  })
}

const clearTerms = (): void => {
  ;[`technologies/${TECH_ID}`, `tags/${TAG_ID}`].forEach((path) => {
    cy.request({
      method: 'DELETE',
      url: `${DOCS}/${path}`,
      headers: OWNER,
      failOnStatusCode: false,
    })
  })
}

describe('Admin Portfolio section', () => {
  beforeEach(() => {
    clearProjects()
    clearTerms()
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

  it('creates, edits, and deletes a project through the form', () => {
    cy.visit(`${ADMIN_URL}/projects`)

    // Create
    cy.get('[data-testid="newProjectButton"]').click()
    cy.url().should('include', '/projects/new')
    cy.get('[data-testid="projectTitleInput"]').type(CREATE_TITLE)
    cy.get('[data-testid="projectDevStatusSelect"]').click()
    cy.get('[data-value="in-development"]').click()
    // CKEditor loads client-side; wait for the editable, then write into it.
    cy.get('[data-testid="projectContentEditor"] .ck-editor__editable', {
      timeout: 20000,
    })
      .should('exist')
      .click()
      .type('Built in the admin editor.')
    cy.get('[data-testid="projectPublish"]').click()

    cy.url().should('match', /\/projects$/)
    rowByTitle(CREATE_TITLE).should('exist')

    // Edit — the title change round-trips through the edit page
    rowByTitle(CREATE_TITLE).find('[data-testid="editProjectTrigger"]').click()
    cy.url().should('include', '/edit')
    cy.get('[data-testid="projectTitleInput"]').should('have.value', CREATE_TITLE)
    cy.get('[data-testid="projectTitleInput"]').clear()
    cy.get('[data-testid="projectTitleInput"]').type(EDIT_TITLE)
    cy.get('[data-testid="projectPublish"]').click()

    cy.url().should('match', /\/projects$/)
    rowByTitle(EDIT_TITLE).should('exist')

    // Delete — restores the empty state so the test is idempotent
    rowByTitle(EDIT_TITLE).find('[data-testid="deleteProjectTrigger"]').click()
    cy.get('[data-testid="confirmDeleteProject"]').click()
    rowByTitle(EDIT_TITLE).should('not.exist')
  })

  it('selects a tag and technology that persist to the project', () => {
    seedTerms()
    cy.visit(`${ADMIN_URL}/projects/new`)

    cy.get('[data-testid="projectTitleInput"]').type(CREATE_TITLE)
    cy.get(`[data-testid="projectTagToggle"][data-slug="${TAG_SLUG}"]`).click()
    cy.get(`[data-testid="projectTechToggle"][data-slug="${TECH_SLUG}"]`).click()
    cy.get('[data-testid="projectSaveDraft"]').click()

    cy.url().should('match', /\/projects$/)

    // The selections round-trip through the saved document to the edit form.
    rowByTitle(CREATE_TITLE).find('[data-testid="editProjectTrigger"]').click()
    cy.get(`[data-testid="projectTagToggle"][data-slug="${TAG_SLUG}"]`).should(
      'have.attr',
      'data-selected',
      'true'
    )
    cy.get(`[data-testid="projectTechToggle"][data-slug="${TECH_SLUG}"]`).should(
      'have.attr',
      'data-selected',
      'true'
    )

    // Clean up the project so the test is idempotent (terms cleared in beforeEach).
    cy.visit(`${ADMIN_URL}/projects`)
    rowByTitle(CREATE_TITLE).find('[data-testid="deleteProjectTrigger"]').click()
    cy.get('[data-testid="confirmDeleteProject"]').click()
  })

  it('uploads a cover image to storage', () => {
    cy.visit(`${ADMIN_URL}/projects/new`)

    // A 1×1 PNG is enough to exercise the upload → storage → download-URL path.
    const png =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    cy.get('[data-testid="projectCoverFile"]').selectFile(
      {
        contents: Cypress.Buffer.from(png, 'base64'),
        fileName: 'cover.png',
        mimeType: 'image/png',
      },
      { force: true }
    )

    cy.get('[data-testid="projectCoverPreview"]', { timeout: 15000 })
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'project-covers')
  })
})
