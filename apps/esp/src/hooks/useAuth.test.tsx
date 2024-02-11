import { renderHook } from '@testing-library/react';
import { signIn, signOut } from 'next-auth/react';

import useAuth from './useAuth';

// Mock the dependencies
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn().mockReturnValue({}),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn((callback) => callback),
}));

describe('useAuth', () => {
  it('should call signIn with correct parameters', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBe(undefined);

    const email = 'test@example.com';

    result.current.signIn({ email });

    expect(signIn).toHaveBeenCalledWith(
      'okta',
      {
        callbackUrl: window.location.origin,
      },
      {
        username: email,
      }
    );
  });

  it('should call signOut', () => {
    const { result } = renderHook(() => useAuth());

    result.current.signOut();

    expect(signOut).toHaveBeenCalled();
  });
});
