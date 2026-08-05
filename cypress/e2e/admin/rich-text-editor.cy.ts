/// <reference types="cypress" />

const ADMIN_URL = Cypress.env('adminUrl')

// The editor is a shared component; the project form is just a convenient host
// page to mount it on. This spec covers the component itself, not a user journey.
describe('Rich text editor', () => {
  beforeEach(() => {
    cy.loginAdmin()
    cy.visit(`${ADMIN_URL}/projects/new`)
  })

  it('renders editable text in the theme foreground colour (readable in any theme)', () => {
    cy.get('[data-testid="projectContentEditor"] .ck-editor__editable', {
      timeout: 20000,
    }).should(($el) => {
      // The editable must use the app's foreground (which flips with the theme),
      // not CKEditor's fixed dark grey that vanished on a dark background.
      const editableColor = getComputedStyle($el[0]).color
      const appForeground = getComputedStyle($el[0].ownerDocument.body).color
      expect(editableColor).to.eq(appForeground)
    })
  })
})
