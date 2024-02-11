import { AppRouterContextProviderMock } from '@esp/__mocks__/AppRouterContextProviderMock';
import { ThemeContextProvider } from '@ui-kit/contexts/theme-context';
import { render } from '@testing-library/react';

import TaskManagement from './page';

describe('Task Management page', () => {
  it('should render content successfully', () => {
    const { baseElement } = render(
      <ThemeContextProvider>
        <AppRouterContextProviderMock>
          <TaskManagement />
        </AppRouterContextProviderMock>
      </ThemeContextProvider>
    );

    expect(baseElement).not.toBeNull();
  });
});
