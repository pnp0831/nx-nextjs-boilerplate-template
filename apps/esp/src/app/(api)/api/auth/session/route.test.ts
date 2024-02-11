/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { authOptions } from './../../../../../libs/next-auth/index';
import { GET } from './route';

// Mock the dependencies
jest.mock('next-auth/jwt');

describe('GET', () => {
  test('returns Unauthorized response when token is missing or has an error', async () => {
    const mockRequest = new NextRequest('http://localhost:4242/api/auth/session');

    // Mock getToken to return a token with missing perms or an error
    (getToken as jest.Mock).mockResolvedValueOnce({ perms: null, error: true });

    const result = await GET(mockRequest);

    expect(result.status).toBe(401);
    const response = await result.json();

    expect(response).toEqual({
      message: 'Unauthorized',
      code: 401,
    });
  });

  test('returns the session response when the token is valid', async () => {
    const mockRequest = new NextRequest('http://localhost:4242/api/auth/session');

    // Mock getToken to return a valid token
    const validToken = {
      perms: ['read', 'write'],
      error: false,
      name: 'John Doe',
      email: 'johndoe@example.com',
      image: 'avatar.jpg',
      role: 'user',
      id: '123',
      routerPerms: [],
      expiration: Date.now() + 3600 * 1000, // Assuming token expires in 1 hour
    };

    (getToken as jest.Mock).mockResolvedValueOnce(validToken);

    const result = await GET(mockRequest);

    expect(result.status).toBe(200);
    const response = await result.json();

    // Assert that the response matches the session object
    expect(response).not.toBeNull();
  });

  test('returns Unauthorized response when token is missing or has an error', async () => {
    const mockRequest = new NextRequest('http://localhost:4242/api/auth/session');

    // Mock getToken to return a token with missing perms or an error
    (getToken as jest.Mock).mockResolvedValueOnce({ perms: [] });

    if (authOptions.callbacks?.jwt) {
      authOptions.callbacks.jwt = jest.fn().mockResolvedValue({
        perms: [],
        error: 'RefreshAccessTokenError',
      });
    }

    const result = await GET(mockRequest);

    expect(result.status).toBe(401);
    const response = await result.json();

    expect(response).toEqual({
      message: 'Unauthorized',
      code: 401,
    });
  });
});
