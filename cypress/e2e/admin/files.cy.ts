/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

// The storage emulator implements the GCS JSON API, so fixtures can be written
// and cleaned up directly (this bypasses Firebase Storage rules like the Admin SDK).
//
// From the same config the app is built with, not a literal: when the two
// disagreed, this spec seeded one bucket while the app listed another.
const BUCKET = Cypress.env('firebaseConfig').storageBucket
const EMULATOR = Cypress.env('firebaseStorageEmulatorHost') ?? '127.0.0.1:9199'
const OBJECTS = `http://${EMULATOR}/storage/v1/b/${BUCKET}/o`
const UPLOAD = `http://${EMULATOR}/upload/storage/v1/b/${BUCKET}/o`

const ROOT_FOLDER = 'fm-e2e'
const UPLOAD_NAME = 'fm-upload.txt'
const NEW_FOLDER = 'fm-newfolder'
const CLEANUP = [
  `${ROOT_FOLDER}/hello.txt`,
  `${ROOT_FOLDER}/sub/inner.txt`,
  `${ROOT_FOLDER}/world.txt`,
  `${ROOT_FOLDER}/renamed.txt`,
  `${ROOT_FOLDER}/moved/hello.txt`,
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

    // Selecting a file opens the preview with a download link.
    fileRow('hello.txt').click()
    cy.get('[data-testid="filePreview"]').should('be.visible').and('contain', 'hello.txt')
    // The origin matters: a production URL would contain the file name too, and
    // 404 on an object that exists only in the emulator.
    cy.get('[data-testid="previewDownload"]')
      .should('have.attr', 'href')
      .and('include', 'hello.txt')
      .and('include', EMULATOR)
      .and('not.include', 'firebasestorage.googleapis.com')
    cy.get('[data-testid="previewCopy"]').should('exist')
  })

  it('selects and deletes files', () => {
    putObject(`${ROOT_FOLDER}/hello.txt`, 'hello world')
    cy.visit(`${ADMIN_URL}/files`)

    fileRow(ROOT_FOLDER).click()
    fileRow('hello.txt').find('[data-testid="fileCheckbox"]').click()
    cy.get('[data-testid="fmSelectionToolbar"]').should('contain', '1 selected')

    cy.get('[data-testid="fmDelete"]').click()
    cy.get('[data-testid="confirmDeleteFiles"]').click()

    fileRow('hello.txt').should('not.exist')
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

  it('searches within the current folder', () => {
    putObject(`${ROOT_FOLDER}/hello.txt`, 'hi')
    putObject(`${ROOT_FOLDER}/world.txt`, 'yo')
    cy.visit(`${ADMIN_URL}/files`)

    fileRow(ROOT_FOLDER).click()
    fileRow('hello.txt').should('exist')
    fileRow('world.txt').should('exist')

    cy.get('[data-testid="fmSearch"]').type('hello')
    fileRow('hello.txt').should('exist')
    fileRow('world.txt').should('not.exist')
  })

  it('renames a file', () => {
    putObject(`${ROOT_FOLDER}/hello.txt`, 'hi')
    cy.visit(`${ADMIN_URL}/files`)

    fileRow(ROOT_FOLDER).click()
    fileRow('hello.txt').find('[data-testid="fileCheckbox"]').click()
    cy.get('[data-testid="fmRename"]').click()
    cy.get('[data-testid="renameInput"]').clear()
    cy.get('[data-testid="renameInput"]').type('renamed.txt')
    cy.get('[data-testid="renameSubmit"]').click()

    fileRow('renamed.txt').should('exist')
    fileRow('hello.txt').should('not.exist')
  })

  it('moves a file into a subfolder', () => {
    putObject(`${ROOT_FOLDER}/hello.txt`, 'hi')
    cy.visit(`${ADMIN_URL}/files`)

    fileRow(ROOT_FOLDER).click()
    fileRow('hello.txt').find('[data-testid="fileCheckbox"]').click()
    cy.get('[data-testid="fmMove"]').click()
    cy.get('[data-testid="moveInput"]').type(`${ROOT_FOLDER}/moved`)
    cy.get('[data-testid="moveSubmit"]').click()

    fileRow('moved').should('have.attr', 'data-type', 'folder').click()
    fileRow('hello.txt').should('exist')
  })
})
