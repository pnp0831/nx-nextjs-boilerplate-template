import { theme } from '@ui-kit/theme';

import { ESPAlert } from './alert';

describe('<ESPAlert />', () => {
  it.only('mounts with severity info', () => {
    cy.mount(<ESPAlert severity="info">Not important, just to let you knows.</ESPAlert>);
    cy.get('div.MuiPaper-root')
      .contains('Not important, just to let you knows.')
      .should('have.background-color', theme.palette.black.main);
  });

  it('mounts with severity success', () => {
    cy.mount(<ESPAlert severity="success">Great! This is awesome.</ESPAlert>);
    cy.get('div.MuiPaper-root')
      .should('have.background-color', theme.palette.success.main)
      .contains('Great! This is awesome.');
  });

  it('mounts with severity warning', () => {
    cy.mount(<ESPAlert severity="warning">Hmm.. something is not right.</ESPAlert>);
    cy.get('div.MuiPaper-root')
      .contains('Hmm.. something is not right.')
      .should('have.background-color', theme.palette.warning.main);
  });

  it('mounts with severity error', () => {
    cy.mount(<ESPAlert severity="error">Oh no! Something went wrong :(</ESPAlert>);
    cy.get('div.MuiPaper-root')
      .contains('Oh no! Something went wrong :)')
      .should('have.background-color', theme.palette.error.main);
  });
});
