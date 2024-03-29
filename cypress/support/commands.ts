/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable spaced-comment */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<void>,
    switchToJulyMonth(): Chainable<void>
  }
}

Cypress.Commands.add('login', (username, password) => {
  cy.session([ username, password ], () => {
    cy.origin(
      'https://login.microsoftonline.com/',
      { args: { username, password } },
      ({ username, password }) => {
        cy.on('uncaught:exception', err => {
          console.log(`uncaught exeption${err.message}`);
          return false;
        });
        cy.visit('https://login.microsoftonline.com');
        cy.get('[name="loginfmt"]').type(`${username}{enter}`);
        cy.get('[name="passwd"]').type(`${password}{enter}`);
        cy.get('[type="submit"]').click();
      });
  });
});

Cypress.Commands.add('switchToJulyMonth', () => {
  cy.get('.period').invoke('text').then(text => {
    if (text !== 'July 2023') {
      cy.get('.arrow').first().click({ force: true });
      cy.switchToJulyMonth();
    }
  });
});
