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

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const compareColor =
  (color: string, property: keyof CSSStyleDeclaration) => (targetElement: JQuery) => {
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    tempElement.style.display = 'none'; // make sure it doesn't actually render
    document.body.appendChild(tempElement); // append so that `getComputedStyle` actually works

    const tempColor = getComputedStyle(tempElement).color;
    const targetColor = getComputedStyle(targetElement[0])[property];

    document.body.removeChild(tempElement); // remove it because we're done with it

    expect(tempColor).to.equal(targetColor);
  };

Cypress.Commands.overwrite(
  'should',
  (originalFn: Function, subject: any, expectation: any, ...args: any[]) => {
    const customMatchers = {
      'have.background-color': compareColor(args[0], 'backgroundColor'),
      'have.color': compareColor(args[0], 'color'),
    };
    // See if the expectation is a string and if it is a member of Jest's expect
    if (typeof expectation === 'string' && customMatchers[expectation]) {
      return originalFn(subject, customMatchers[expectation]);
    }

    return originalFn(subject, expectation, ...args);
  }
);
