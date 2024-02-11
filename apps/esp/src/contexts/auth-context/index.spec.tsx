import { AppRouterContextProviderMock } from '@esp/__mocks__/AppRouterContextProviderMock';
import { render } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { AuthContextProvider } from './';

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
  useRouter: jest.fn().mockReturnValue({
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useServerInsertedHTML: jest.fn(),
}));

describe('AuthContextProvider', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('renders children without session ', () => {
    (usePathname as jest.Mock).mockReturnValue('/login');

    render(
      <AppRouterContextProviderMock>
        <AuthContextProvider session={null}>
          <div>hello</div>
        </AuthContextProvider>
      </AppRouterContextProviderMock>
    );
  });

  test('redirects to login page when unauthenticated', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(
      <AppRouterContextProviderMock>
        <AuthContextProvider session={null}>
          <div>hello</div>
        </AuthContextProvider>
      </AppRouterContextProviderMock>
    );

    expect(useRouter().replace).toHaveBeenCalledWith('/login');
  });

  test('redirects to home page when authenticated', () => {
    (usePathname as jest.Mock).mockReturnValue('/login');

    render(
      <AppRouterContextProviderMock>
        <AuthContextProvider
          session={{
            user: {
              id: 'userId',
              name: 'User name',
              role: 'Admin',
              perms: [],
            },
            expires: '',
          }}
        >
          <div>hello</div>
        </AuthContextProvider>
      </AppRouterContextProviderMock>
    );

    expect(useRouter().replace).toHaveBeenCalledWith('/');
  });
});
