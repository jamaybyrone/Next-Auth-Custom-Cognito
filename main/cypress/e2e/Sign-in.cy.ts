import {GET} from "../../src/app/api/password/forgot/route";

const NEXT_PUBLIC_URL = 'http://localhost:3000'

const PAGE_URL = NEXT_PUBLIC_URL+'/sign-in'

describe("Sign in should pass accessibility ", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL);
    cy.injectAxe()
  });
  context('Given the user is on the website', () => {
    context('When they navigate to the login page', () => {
      it('should have no accessibility errors.', () => {
        cy.checkAccessibility()
      })
    })
  })
});

describe("Navigate to Login Page", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL);
  });
  context('Given the user is on the website', () => {
    context('When they navigate to the login page', () => {


      it('Then the login page should be displayed with fields for username and password.', () => {
        cy.get('h1').contains('Sign in');
        cy.get('input[name="emailAddress"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
      })
    })
  })
});

describe("Enter Invalid Credentials", () => {

  beforeEach(() => {
    cy.visit(PAGE_URL)
    cy.intercept(
        "POST",

        NEXT_PUBLIC_URL + "/api/auth/callback/credentials",
        { statusCode: 401, body:{"url":NEXT_PUBLIC_URL + "/api/auth/error?error=Network%20error"} }
    );
  });
  context('Given the user is on the website', () => {
    context('When they enter a invalid email or password', () => {
      it('Then a error should a appear', () => {
        cy.get('input[name="emailAddress"]').type('email@email.com');
        cy.get('input[name="password"]').type('aPassword134&');
        cy.get('button[type="submit"]').click();
        cy.get('[role="alert"]')
            .should('be.visible')
            .and('contain', 'Incorrect username or password');

      })
    })
  })
});


describe.only("Enter Valid Credentials", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL)
    cy.intercept(
        "POST",
        NEXT_PUBLIC_URL + "/api/auth/callback/credentials",
        { statusCode: 201, body:{"url":NEXT_PUBLIC_URL + "/api/auth/error?error=Network%20error"} }
    );
  });
  context('Given the user is on the website', () => {
    context('When they enter a valid email or password', () => {
      it('They should be redirected', () => {
        cy.get('input[name="emailAddress"]').type('email@email.com');
        cy.get('input[name="password"]').type('aPassword134&');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/members');
      })
    })
  })
});

describe("Forgot Password", () => {
  beforeEach(() => {
    cy.intercept(
        "GET",
        NEXT_PUBLIC_URL + "/api/password/forgot",
        { statusCode: 200, body:{email: 'email@email.com'} }
    );

    cy.visit(PAGE_URL)
    cy.get('button').contains('Forgot your password?').click();


  });
  context('Given the user is on the website', () => {
    context('When they click on forgot password', () => {
      it('They should be presented with a dialog', () => {
        cy.get('h2').contains('Reset password');
      })
      context('When they enter a valid email and proceed', () => {
        it('They should be redirected', () => {
          cy.get('input[name="forgotEmailAddress"]').type('email@email.com');
          cy.get('button').contains('Continue').click();
          cy.url().should('include', '/reset?');
        })
      })
    })
  })
});
