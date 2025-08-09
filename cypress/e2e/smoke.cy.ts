describe('Smoke test (infrastructure only)', () => {
  it('loads an external page to verify Cypress wiring', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('Kitchen Sink').should('exist')
  })
})
