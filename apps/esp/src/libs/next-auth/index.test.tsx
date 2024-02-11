import { generateToken, refreshToken } from '@esp/apis/authorization';
import { REFRESH_TOKEN_ERROR } from '@esp/constants';
import dayjs from 'dayjs';

import { authOptions, isTokenExpired, refreshAccessToken } from './index';

jest.mock('next-auth/jwt');

jest.mock('@esp/apis/authorization', () => ({
  generateToken: jest.fn().mockResolvedValue({ data: { accessToken: 'mocked-token' } }),
  refreshToken: jest.fn().mockResolvedValue({ data: { accessToken: 'refreshed-token' } }),
  mockResponseGenerateToken: {
    data: {
      accessToken:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibjE0ZGNjbjIxN0BzdHVkZW50LnB0aXRoY20uZWR1LnZuIiwianRpIjoiZjAzOTY3NjQtNDExMi00MTZhLThiZDEtY2MyZmI0ZjRmZGU1IiwiUGVybWlzc2lvbiI6WyJUYXNrTWFuYWdlbWVudC5BZG1pbi5NYW5hZ2VUYXNrIiwiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlRW1wbG95ZWUiLCJUYXNrTWFuYWdlbWVudC5BZG1pbi5NYW5hZ2VSZXNvdXJjZSIsIlRhc2tNYW5hZ2VtZW50LkFkbWluLk1hbmFnZVRpbWUiXSwiZXhwIjoxNjg5MjQwNzM3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.QGLcpFwOGfe1AefW4EMYwO62A4tSdSi7ZV70r5Miw2N3V__30hMkyYgjH7tUScP4HLqbLZLJMwmkfci3-un6fHIYzuL1y5mgofPE0SevfiqRSH5o7gJXQVFtbErcHtTvPAJSlJLInJK2GDDhadnntsPa78lynsHk8E2TDmmdwIZBUOMtQ10kn2c__wirfdDQt6gCmEZ01wpMdW0pK-hUI6iWU6Npaax4QrfU0Wy4j14HT2qM--73Tp0mgCQuxf0IfKzuKV1iJbWDuVAYZey4yMC61-Q-f02AHrYVT9VrW9Id41KFA7RpCC5vDTWiMuHaTtQiG92QCVIsbP39tyo8FQ',
      expiration: new Date().toISOString(),
      refreshToken:
        'BE3BCluKIp+QAVY+svDbBYR5QX0sQ5lVs5f51ZaHnv4wewQwjGO4s2w4QyBSGv8xxdJrZqMW1yw/Zes19jtq0A==',
    },
  },
}));

jest.mock('@esp/utils/helper', () => ({
  getUserRole: jest.fn().mockReturnValue('user-role'),
  getRouterPermissions: jest.fn().mockReturnValue(['/home']),
  isTokenExpired: jest.fn().mockReturnValue(false),
  handleMockData: jest.fn(),
}));

jest.mock('jwt-decode', () => jest.fn().mockReturnValue({ Permission: ['permission'] }));

describe('isTokenExpired', () => {
  test('returns true if the token is expired', () => {
    const result = isTokenExpired(Date.now() - 1000);

    expect(result).toBe(true);
  });

  test('returns false if the token is not expired', () => {
    const result = isTokenExpired(Date.now() + 1000);

    expect(result).toBe(false);
  });
});

describe('refreshAccessToken', () => {
  test('returns the refreshed token', async () => {
    const token = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: 123456789,
      expiration: '2022-01-01T00:00:00Z',
    };

    const result = await refreshAccessToken(token);

    expect(result.accessToken).toBe('access-token');
  });

  test('returns the error token', async () => {
    const token = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: 123456789,
      expiration: '2022-01-01T00:00:00Z',
    };

    const error = new Error('error');

    (refreshToken as jest.Mock).mockRejectedValue(error);

    const result = await refreshAccessToken(token);

    expect(result.error).toBe(REFRESH_TOKEN_ERROR);
  });
});

describe('authOptions', () => {
  test('returns expected signIn response', async () => {
    const signInCallback = authOptions.callbacks?.signIn;
    const result = await signInCallback?.({
      user: {},
      account: {},
    });
    // Assert the expected response
    expect(result).toBe(true);
  });

  test('returns expected jwt response', async () => {
    const jwtCallback = authOptions.callbacks?.jwt;
    const token = {
      accessToken: 'access-token',
      expiresAt: 1234789,
      expiration: dayjs().add(5, 'm').toISOString(),
    };
    (generateToken as jest.Mock).mockResolvedValue({ data: token });
    const account = { access_token: 'access-token' };
    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
    };
    const result = await jwtCallback?.({ token, account, user });
    expect(result?.accessToken).toBe('access-token');
    expect(result?.image).toBe('/images/rose.png');
  });

  test('returns expected jwt response without account', async () => {
    const jwtCallback = authOptions.callbacks?.jwt;
    const token = {
      accessToken: 'access-token',
      expiresAt: 1234789,
      expiration: dayjs().add(5, 'm').toISOString(),
    };

    const account = null;
    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'avatar.jpg',
    };
    const result = await jwtCallback?.({ token, account, user });
    expect(result?.accessToken).toBe('access-token');
  });

  test('returns expected jwt error response', async () => {
    const jwtCallback = authOptions.callbacks?.jwt;
    const token = { accessToken: 'access-token', expiresAt: dayjs().add(1, 'm').toISOString() };
    const account = { access_token: 'access-token' };
    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'avatar.jpg',
    };
    const error = new Error('error');
    (generateToken as jest.Mock).mockRejectedValue(error);
    const result = await jwtCallback?.({ token, account, user });
    if (result) {
      expect(result.accessToken).toBe('access-token');
    }
  });

  test('returns expected jwt response without response', async () => {
    const jwtCallback = authOptions.callbacks?.jwt;
    const token = { accessToken: 'access-token', expiresAt: 1234789, expiration: 12345678 };
    (generateToken as jest.Mock).mockResolvedValue({});
    const account = { access_token: 'access-token' };
    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'avatar.jpg',
    };
    const result = await jwtCallback?.({ token, account, user });
    expect(result?.accessToken).toBe(undefined);
  });

  test('returns expected session response', async () => {
    const sessionCallback = authOptions.callbacks?.session;
    const session = {};
    const token = {
      accessToken: 'access-token',
      expiresAt: 123456789,
      refreshToken: 'refresh-token',
      expiration: '2022-01-01T00:00:00Z',
      name: 'userName',
    };

    const result = await sessionCallback?.({ session, token });

    expect(result?.user?.name).toBe('userName');
  });

  test('returns expected session to be null', async () => {
    const sessionCallback = authOptions.callbacks?.session;
    const session = {};
    const token = {
      refreshToken: 'refresh-token',
      expiration: '2022-01-01T00:00:00Z',
      name: 'userName',
    };

    const result = await sessionCallback?.({ session, token });

    expect(result).toEqual({});
  });
});
