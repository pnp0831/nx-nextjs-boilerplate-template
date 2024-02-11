import { render } from '@testing-library/react';
import React from 'react';

import { ReactQueryClient } from './index';

describe('React Query Client', () => {
  test('AppContextProvider should render its children', () => {
    const { getByTestId } = render(
      <ReactQueryClient>
        <div data-testid="child-component">Child Component</div>
      </ReactQueryClient>
    );

    const childComponent = getByTestId('child-component');
    expect(childComponent).toBeInTheDocument();
  });
});
