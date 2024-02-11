/**
 * @jest-environment node
 */

import { GET, POST } from './route';

// Mock the dependencies and helper functions
jest.mock('next-auth/jwt');
jest.mock('@esp/apis/authorization', () => ({
  generateToken: jest.fn().mockResolvedValue({ data: { accessToken: 'mocked-token' } }),
  refreshToken: jest.fn().mockResolvedValue({ data: { accessToken: 'refreshed-token' } }),
}));
jest.mock('@esp/utils/helper', () => ({
  getUserRole: jest.fn().mockReturnValue('user-role'),
  getRouterPermissions: jest.fn().mockReturnValue(['/home']),
  isTokenExpired: jest.fn().mockReturnValue(false),
}));

describe('GET Provider', () => {
  test('GET should be truthy', async () => {
    expect(GET).toBeTruthy();
  });
});

describe('POST route', () => {
  test('POST should be truthy', async () => {
    expect(POST).toBeTruthy();
  });
});
