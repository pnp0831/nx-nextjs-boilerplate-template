import { render, screen } from '@testing-library/react';

import ThemeContextProvider from './';

describe('ThemeContextProvider', () => {
  test('renders children components with the theme and necessary providers', () => {
    const TestComponent = () => {
      return <div data-testid="test-component">Test Component</div>;
    };

    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const testComponent = screen.getByTestId('test-component');

    expect(testComponent).toBeInTheDocument();
  });
});
