const NEXT_PUBLIC_URL = 'http://localhost:3000'
const PAGE_URL = NEXT_PUBLIC_URL+'/reset'

describe("Reset page should be pass accessibility ", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL);
    cy.injectAxe()
  });
  context('Given the user is on the website', () => {
    context('When they navigate to the reset page', () => {
      it('should have no accessibility errors.', () => {
        cy.checkAccessibility()
      })
    })
  })
});

describe("Navigate to Reset Page", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL);
  });
  context('Given the user is on the website', () => {
    context('When they navigate to the reset page', () => {


      it('Then the reset page should be displayed with fields.', () => {
        cy.get('h1').contains('Reset password');
        cy.get('input[name="code"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('input[name="passwordConfirmation"]').should('be.visible');
      })
    })
  })
});

describe("Enter invalid Code", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL)
    cy.intercept(
        "POST",
        NEXT_PUBLIC_URL + "/api/password/reset",
        { statusCode: 401, body:{"error":'do one'} }
    );
  });


  context('Given the user is on the confirm page', () => {
    context('When they enter a invalid code', () => {
      it('Then a error should a appear', () => {
        cy.get('input[name="code"]').type('32432');
        cy.get('input[name="password"]').type('WhatALovelypASS!');
        cy.get('input[name="passwordConfirmation"]').type('WhatALovelypASS!');
        cy.get('button[type="submit"]').click();
        cy.get('[role="alert"]')
            .should('be.visible')
            .and('contain', 'invalid code, try again');

      })
    })
  })
});
describe("Resend Code", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL)
    cy.intercept(
        "POST",
        NEXT_PUBLIC_URL + "/api/confirm/resend",
        { statusCode: 200, body:{"email":'test@test.com'} }
    );
  });
  context('Given the user is on the reset page', () => {
    context('When they click resend', () => {
      it('Then they should get a success message', () => {
        cy.get('button').contains('Resend').click();
        cy.get('[role="alert"]')
            .should('be.visible')
            .and('contain', 'resent code to');

      })
    })
  })
});

describe("Enter valid Code", () => {
  beforeEach(() => {
    cy.visit(PAGE_URL)
    cy.intercept(
        "POST",
        NEXT_PUBLIC_URL + "/api/password/reset",
        { statusCode: 200, body:{"email":'test@test.com'} }
    );
  });
  context('Given the user is on the reset page', () => {
    context('When they enter a valid code', () => {
      it('Then they should be redirected', () => {
        cy.get('input[name="code"]').type('32432');
        cy.get('input[name="password"]').type('WhatALovelypASS!');
        cy.get('input[name="passwordConfirmation"]').type('WhatALovelypASS!');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '?forgot=true');

      })
    })
  })
});
