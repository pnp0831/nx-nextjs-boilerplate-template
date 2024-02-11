import { render, screen } from '@testing-library/react';
import React from 'react';

import { AppClientConfigProvider } from './index';

describe('AppClientContext', () => {
  test('AppClientContextProvider should render its children', () => {
    render(
      <AppClientConfigProvider appConfigs={{}}>
        <div data-testid="child-component">Child Component</div>
      </AppClientConfigProvider>
    );

    const childComponent = screen.getByTestId('child-component');
    expect(childComponent).toBeInTheDocument();
  });
});
