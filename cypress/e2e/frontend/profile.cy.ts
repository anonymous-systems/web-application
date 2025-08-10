describe('Profile Page', () => {
  it('should redirect to sign-in page if user is not authenticated', () => {
    cy.logout()
    cy.visit('/profile')
    cy.url().should('include', '/sign-in')
    cy.get('[data-testid="profilePage"]').should('not.exist')
    cy.get('[data-testid="signInPage"]').should('exist')
  })

  it('should redirect to onboard page if user has not completed onboarding', () => {
    cy.login(true)
    cy.visit('/profile')
    cy.url().should('include', '/onboarding')
    cy.get('[data-testid="profilePage"]').should('not.exist')
    cy.get('[data-testid="onboardingPage"]').should('exist')
  })

  it('should display the profile page when user is authenticated and has completed onboarding', () => {
    cy.login()
    cy.visit('/profile')

    cy.get('[data-testid="profilePage"]').should('exist')
    cy.get('[data-testid="displayName"]').should('contain.text', 'Cypress User')
    cy.get('[data-testid="username"]').should('contain.text', '@cypressuser')
  })
})