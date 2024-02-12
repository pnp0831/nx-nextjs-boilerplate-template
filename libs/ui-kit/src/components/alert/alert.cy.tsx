import Alert from './alert';

describe('<Stepper />', () => {
  it.only('mounts', () => {
    cy.mount(<Alert />);
  });
});
