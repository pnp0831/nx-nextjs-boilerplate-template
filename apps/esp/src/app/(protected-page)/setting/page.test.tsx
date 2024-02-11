import { AppRouterContextProviderMock } from '@esp/__mocks__/AppRouterContextProviderMock';
import { ThemeContextProvider } from '@ui-kit/contexts/theme-context';
import { render } from '@testing-library/react';

import SettingPage from './page';

describe('Service Management page', () => {
  it('should render content successfully', () => {
    const { baseElement } = render(
      <ThemeContextProvider>
        <AppRouterContextProviderMock>
          <SettingPage />
        </AppRouterContextProviderMock>
      </ThemeContextProvider>
    );

    expect(baseElement).not.toBeNull();
  });
});
