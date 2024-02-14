import './styles.ct.css';
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.ts using ES2015 syntax:
import './commands';

import { ThemeContextProvider } from '@ui-kit/contexts/theme-context';
import { mount } from 'cypress/react18';

Cypress.Commands.add('mount', (component, options) => {
  // cy.stub(Fonts, 'Lato').callsFake(() => ({
  //   weight: ['100', '300', '400', '700', '900'],
  //   subsets: ['latin'],
  //   display: 'swap',
  // }));

  return mount(<ThemeContextProvider>{component}</ThemeContextProvider>, options);
});
