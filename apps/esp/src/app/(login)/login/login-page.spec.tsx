import { mockCommonUser } from '@esp/__mocks__/data-mock';
import useAuth from '@esp/hooks/useAuth';
import { act, fireEvent, render } from '@testing-library/react';
import { ThemeContextProvider } from '@ui-kit/contexts/theme-context';

import RootLayout from './layout';
import Login from './page';

jest.mock('next-auth/react');

jest.mock('@esp/hooks/useAuth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      signIn: jest.fn(),
      signOut: jest.fn(),
      user: mockCommonUser,
    })),
  };
});

describe('Login page', () => {
  it('should render content successfully', () => {
    const { getByRole, getByPlaceholderText } = render(
      <ThemeContextProvider>
        <Login />
      </ThemeContextProvider>
    );

    const img = getByRole('img', { name: 'Simpson Strong Tie' });
    const emailInput = getByPlaceholderText('Email');
    const forgotPassLink = getByRole('link', { name: 'Forgot password?' });
    const signInButton = getByRole('button', { name: 'Sign In' });

    expect(img && emailInput && forgotPassLink && signInButton).toBeInTheDocument();
  });

  it('should layout render content successfully', () => {
    const { getByText } = render(
      <ThemeContextProvider>
        <RootLayout>
          <div>login layout</div>
        </RootLayout>
      </ThemeContextProvider>
    );

    expect(getByText('login layout')).toBeInTheDocument();
  });

  it('should trigger onSubmit func successfully', async () => {
    const email = 'phpham@example.com';
    const mockSignIn = jest.fn();

    useAuth.mockReturnValue({
      signIn: mockSignIn,
      signOut: jest.fn(),
      user: mockCommonUser,
    });

    const { getByRole, container } = render(
      <ThemeContextProvider>
        <Login />
      </ThemeContextProvider>
    );

    const emailInput = container.querySelector('input[name="email"]');

    if (emailInput) {
      fireEvent.change(emailInput, {
        target: {
          value: email,
        },
      });

      const signInButton = getByRole('button', { name: 'Sign In' });
      await act(async () => {
        fireEvent.click(signInButton);
      });

      const { signIn } = useAuth();

      expect(signIn).toHaveBeenCalledTimes(1);
      expect(signIn).toHaveBeenCalledWith(
        expect.objectContaining({
          email: email,
        })
      );
    }
  });
});
