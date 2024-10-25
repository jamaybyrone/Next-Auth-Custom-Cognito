const NEXT_PUBLIC_URL = 'http://localhost:3000'

describe("Home page should pass accessibility ", () => {
  beforeEach(() => {
    cy.visit(NEXT_PUBLIC_URL);
    cy.injectAxe()
  });
  context('Given the user is on the website', () => {
    context('When they navigate to the home page', () => {
      it('should have no accessibility errors.', () => {
        cy.checkAccessibility()
      })
    })
  })
});

describe("Navigate to Home Page", () => {
  beforeEach(() => {
    cy.visit(NEXT_PUBLIC_URL);
  });
  context('Given the user is on the website', () => {
    context('When they navigate to the Home page', () => {


      it('Then the home page should be displayed', () => {
        cy.get('h1').contains('Welcome');
      })
    })
  })
});

