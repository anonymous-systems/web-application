/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

// The storage emulator implements the GCS JSON API, so fixtures can be written
// and cleaned up directly (this bypasses Firebase Storage rules like the Admin SDK).
const BUCKET = 'anonymous-systems-dev.appspot.com'
const OBJECTS = `http://127.0.0.1:9199/storage/v1/b/${BUCKET}/o`
const UPLOAD = `http://127.0.0.1:9199/upload/storage/v1/b/${BUCKET}/o`

const ROOT_FOLDER = 'fm-e2e'
const UPLOAD_NAME = 'fm-upload.txt'
const NEW_FOLDER = 'fm-newfolder'
const CLEANUP = [
  `${ROOT_FOLDER}/hello.txt`,
  `${ROOT_FOLDER}/sub/inner.txt`,
  UPLOAD_NAME,
  `${NEW_FOLDER}/.keep`,
]

const putObject = (name: string, body: string): void => {
  cy.request({
    method: 'POST',
    url: `${UPLOAD}?uploadType=media&name=${encodeURIComponent(name)}`,
    headers: { 'Content-Type': 'text/plain' },
    body,
  })
}

const removeSeeded = (): void => {
  CLEANUP.forEach((name) => {
    cy.request({
      method: 'DELETE',
      url: `${OBJECTS}/${encodeURIComponent(name)}`,
      failOnStatusCode: false,
    })
  })
}

const fileRow = (name: string) =>
  cy.get(`[data-testid="fileRow"][data-name="${name}"]`)

describe('Admin Files section', () => {
  beforeEach(() => {
    removeSeeded()
    cy.loginAdmin()
  })

  it('renders the files section', () => {
    cy.visit(`${ADMIN_URL}/files`)

    cy.get('[data-testid="filesPage"]').should('exist')
    cy.get('[data-testid="filesTable"]').should('exist')
    cy.get('[data-testid="fmHome"]').should('be.disabled')
  })

  it('lists files/folders, navigates, and previews', () => {
    putObject(`${ROOT_FOLDER}/hello.txt`, 'hello world')
    putObject(`${ROOT_FOLDER}/sub/inner.txt`, 'nested file')
    cy.visit(`${ADMIN_URL}/files`)

    // The seeded folder shows at the root; open it.
    fileRow(ROOT_FOLDER).should('have.attr', 'data-type', 'folder').click()
    fileRow('hello.txt').should('exist')
    fileRow('sub').should('have.attr', 'data-type', 'folder')

    // Into the nested folder, then back via breadcrumb.
    fileRow('sub').click()
    fileRow('inner.txt').should('exist')
    cy.contains('nav button', ROOT_FOLDER).click()
    fileRow('hello.txt').should('exist')

    // Selecting a file opens the metadata preview.
    fileRow('hello.txt').click()
    cy.get('[data-testid="filePreview"]').should('be.visible').and('contain', 'hello.txt')
  })

  it('uploads a file via the Upload button', () => {
    cy.visit(`${ADMIN_URL}/files`)

    cy.get('[data-testid="fmFileInput"]').selectFile(
      {
        contents: Cypress.Buffer.from('uploaded via button'),
        fileName: UPLOAD_NAME,
        mimeType: 'text/plain',
      },
      { force: true }
    )

    fileRow(UPLOAD_NAME).should('exist')
  })

  it('creates a new folder', () => {
    cy.visit(`${ADMIN_URL}/files`)

    cy.get('[data-testid="fmNewFolder"]').click()
    cy.get('[data-testid="folderNameInput"]').type(NEW_FOLDER)
    cy.get('[data-testid="folderSubmit"]').click()

    fileRow(NEW_FOLDER).should('have.attr', 'data-type', 'folder')
  })
})
