import { AppRouterContextProviderMock } from '@esp/__mocks__/AppRouterContextProviderMock';
import { fireEvent, render } from '@testing-library/react';
import { ThemeContextProvider } from '@ui-kit/contexts/theme-context';

import NoPermission from './page';

describe('No permission page', () => {
  it('should render default successfully', () => {
    const push = jest.fn();

    const { getByRole } = render(
      <AppRouterContextProviderMock router={{ push }}>
        <ThemeContextProvider>
          <NoPermission />
        </ThemeContextProvider>
      </AppRouterContextProviderMock>
    );

    const img = getByRole('img', { name: 'Simpson Strong Tie' });
    const heading = getByRole('heading', { name: 'Site access denied' });
    expect(img && heading).toBeInTheDocument();
  });

  it('click backToHome should redirect to homepage successfully', () => {
    const push = jest.fn();

    const { getByRole } = render(
      <AppRouterContextProviderMock router={{ push }}>
        <ThemeContextProvider>
          <NoPermission />
        </ThemeContextProvider>
      </AppRouterContextProviderMock>
    );

    const backToHomeButton = getByRole('button', { name: 'Back to home' });
    fireEvent.click(backToHomeButton);

    expect(push).toHaveBeenLastCalledWith('/');
  });
});
