describe('Sign-In Page', () => {
  beforeEach(() => {
    cy.logout()
  })

  it('should display the sign-in page when not authenticated', () => {
    cy.visit('/sign-in')
    cy.get('[data-testid="signInPage"]').should('exist')
    cy.get('[data-testid="pageTitle"]').should('contain', 'Sign in')
  })

  it('should redirect authenticated users to the home page', () => {
    cy.login()
    cy.visit('/sign-in')
    cy.get('[data-testid="signInPage"]').should('not.exist')
    cy.get('[data-testid="homePage"]').should('exist')
  })

  it('should initiate Google sign-in and disable the button during the process', () => {
    cy.visit('/sign-in', {
      onBeforeLoad(win) {
        cy.stub(win, 'open')
      }
    })

    cy.get('[data-testid="googleSignInButton"]').click()
    cy.get('[data-testid="googleSignInButton"]').should('be.disabled')
    cy.window().its('open').should('be.called')
  })

  it('should navigate to the sign-up page when the sign-up button is clicked', () => {
    cy.visit('/sign-in')

    cy.get('[data-testid="signUpButton"]').click()
    // Verify that the URL changes to the sign-up page
    cy.url().should('include', '/sign-up')
  })
})