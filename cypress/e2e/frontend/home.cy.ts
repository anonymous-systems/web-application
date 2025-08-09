describe('Home Page', () => {
  it('renders the 3D Sphere component', () => {
    cy.visit('/')
    cy.get('[data-testid="homePage"]').should('exist')
    cy.get('[data-testid="threeDSphere"]').should('exist')
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      cy.logout()
      cy.visit('/')
    })

    it('shows the home page', () => {
      cy.get('[data-testid="homePage"]').should('exist')
    })
    it ('shows the sign-in button in the header', () => {
      cy.get('[data-testid="signInButton"]').should('exist')
      cy.get('[data-testid="userAvatar"]').should('not.exist')
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
    })

    it('shows the home page', () => {
      cy.get('[data-testid="homePage"]').should('exist')
    })

    it ('shows the user avatar in the header', () => {
      cy.get('[data-testid="signInButton"]').should('not.exist')
      cy.get('[data-testid="userAvatar"]').should('exist')
    })
  })
})