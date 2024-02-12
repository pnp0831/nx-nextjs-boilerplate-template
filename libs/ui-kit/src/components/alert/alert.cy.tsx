import Alert from './alert';

describe('<Alert />', () => {
  it.only('mounts', () => {
    cy.mount(<Alert />);
  });
});
