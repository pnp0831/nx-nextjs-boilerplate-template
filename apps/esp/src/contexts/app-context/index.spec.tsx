import useMediaQuery from '@mui/material/useMediaQuery';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { AppContextProvider, useAppContext } from './index';

jest.mock('@mui/material/styles', () => ({
  useTheme: jest.fn(() => ({
    breakpoints: {
      up: jest.fn().mockReturnValue('md'), // Replace 'md' with the desired breakpoint value
    },
  })),
}));
jest.mock('@mui/material/useMediaQuery', () => jest.fn());

describe('AppContext', () => {
  test('AppContextProvider should render its children', () => {
    render(
      <AppContextProvider>
        <div data-testid="child-component">Child Component</div>
      </AppContextProvider>
    );

    const childComponent = screen.getByTestId('child-component');
    expect(childComponent).toBeInTheDocument();
  });

  test('useAppContext should return the correct context values', () => {
    const TestComponent = () => {
      const appContext = useAppContext();

      expect(appContext.toggleSidebar).toBeInstanceOf(Function);
      expect(appContext.toggleSidebarMobile).toBeInstanceOf(Function);
      expect(appContext.sidebarOpen).toBe(true);
      expect(appContext.sidebarMobileOpen).toBe(false);
      expect(appContext.sidebarWidth).toBe('4.625rem');
      expect(appContext.sidebarOpenWidth).toBe('15rem');

      return null;
    };

    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );
  });

  test('toggleSidebarMobile should toggle the sidebarMobileOpen value', () => {
    const TestComponent = () => {
      const appContext = useAppContext();

      return (
        <div>
          <button onClick={appContext.toggleSidebarMobile} data-testid="toggle-button">
            Toggle Sidebar Mobile
          </button>
          <span data-testid="sidebar-mobile-value">{String(appContext.sidebarMobileOpen)}</span>
        </div>
      );
    };

    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    const sidebarMobileValue = screen.getByTestId('sidebar-mobile-value');

    expect(sidebarMobileValue.textContent).toBe('false');

    fireEvent.click(toggleButton);

    expect(sidebarMobileValue.textContent).toBe('true');

    fireEvent.click(toggleButton);

    expect(sidebarMobileValue.textContent).toBe('false');
  });

  test('toggleSidebar should toggle the sidebarMobile value', () => {
    const TestComponent = () => {
      const appContext = useAppContext();

      return (
        <div>
          <button onClick={appContext.toggleSidebar} data-testid="toggle-button">
            Toggle Sidebar Mobile
          </button>
          <span data-testid="sidebar-value">{String(appContext.sidebarOpen)}</span>
        </div>
      );
    };

    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    const sidebarValue = screen.getByTestId('sidebar-value');

    expect(sidebarValue.textContent).toBe('true');

    fireEvent.click(toggleButton);

    expect(sidebarValue.textContent).toBe('false');

    fireEvent.click(toggleButton);

    expect(sidebarValue.textContent).toBe('true');
  });

  test('updates sidebarMobileOpen state when screenDesktop changes', () => {
    useMediaQuery.mockReturnValue(true);

    const TestComponent = () => {
      const appContext = useAppContext();

      return (
        <div>
          <button onClick={appContext.toggleSidebarMobile} data-testid="toggle-button">
            click me
          </button>
          <span data-testid="sidebar-value">{String(appContext.sidebarOpen)}</span>
        </div>
      );
    };

    const { getByText } = render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );

    const button = getByText('click me');

    fireEvent.click(button);
  });
});
