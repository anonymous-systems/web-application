describe('Welcome Page', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit('/welcome')
  })

  it('should display the welcome page when not authenticated', () => {
    cy.get('[data-testid="welcomePage"]').should('exist')
    cy.get('[data-testid="pageTitle"]').should('contain', 'Welcome to Anonymous Systems')
  })

  it('should navigate to the sign-in page when the Get Started button is clicked', () => {
    cy.get('[data-testid="getStartedButton"]').click()
    cy.url().should('include', '/sign-in')
  })

  it('should navigate to the sign-in page when the Sign in line is clicked', () => {
    cy.get('[data-testid="signInButton"]').click()
    cy.url().should('include', '/sign-in')
  })
})