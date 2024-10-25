const NEXT_PUBLIC_URL = 'http://localhost:3000'
const PAGE_URL = NEXT_PUBLIC_URL+'/sign-up'

describe("Sign up page should pass accessibility ", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL);
    cy.injectAxe()
  });
  context('Given the user is on the website', () => {
    context('When they navigate to the sign up page', () => {
      it('should have no accessibility errors.', () => {
        cy.checkAccessibility()
      })
    })
  })
});

describe("Navigate to Sign up Page", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL);
  });
  context('Given the user is on the website', () => {
    context('When they navigate to the Sign up page', () => {


      it('Then the confirm page should be displayed with fields for code.', () => {
        cy.get('h1').contains('Sign up');
        cy.get('input[name="emailAddress"]').should('be.visible');
        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('input[name="passwordConfirmation"]').should('be.visible');
      })
    })
  })
});

describe("Enter Valid Details", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL)
    cy.intercept(
        "POST",
        NEXT_PUBLIC_URL + "/api/signup",
        { statusCode: 200, body:{"success":'do one'} }
    );
  });


  context('Given the user is on the sign up page', () => {
    context('When they enter a valid details', () => {
      it('Then a should redirect', () => {
        cy.get('input[name="emailAddress"]').type('test@test.com');
        cy.get('input[name="name"]').type('Mr T Tester');
        cy.get('input[name="password"]').type('WhatALovelypASS!');
        cy.get('input[name="passwordConfirmation"]').type('WhatALovelypASS!');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/confirm');

      })
    })
  })
});
