/**
 * @jest-environment node
 */
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { encode, getToken } from 'next-auth/jwt';
import { JWT } from 'next-auth/jwt/types';

import { refreshToken } from '../../apis/authorization';
import appConfigs from '../../constants/config';
import stackMiddlewares from './stack-middleware';
import withAuthorization from './with-authorization';
import withPermissions from './with-permissions';
import withProxyApi from './with-proxy-api';
import withRefreshToken from './with-refresh-token';

jest.mock('@esp/apis/authorization', () => ({
  refreshToken: jest.fn(),
}));

const mockNextFetchEvent = {
  sourcePage: '/src/middleware',
} as NextFetchEvent;

describe('stackMiddleware', () => {
  test('stackMiddleware should return correctly', async () => {
    const stackMiddleware = stackMiddlewares([]);

    expect(stackMiddleware).toBeTruthy();
  });

  test('middleware chain runs in the correct order', async () => {
    const request = new NextRequest('http://localhost:4242/api/auth/session');

    const middleware1 = jest.fn((next) => next);
    const middleware2 = jest.fn((next) => next);

    const middleware = stackMiddlewares([middleware1, middleware2]);
    await middleware(request, mockNextFetchEvent, {});

    expect(middleware1).toHaveBeenCalled();
    expect(middleware2).toHaveBeenCalled();
  });

  test('middleware returns NextResponse.next() when no middlewares provided', async () => {
    const request = new NextRequest('http://localhost:4242/api/auth/session');

    const middleware1 = jest.fn((next) => next);

    const middleware = stackMiddlewares([middleware1]);
    const result = await middleware(request, mockNextFetchEvent, {});

    expect(result).toBeInstanceOf(NextResponse);
    expect(result).toEqual(NextResponse.next());
  });
});

describe('withProxyApi', () => {
  test('withProxyApi should return correctly', async () => {
    expect(withPermissions).toBeTruthy();
  });

  test('should rewrite the request and attach authorization header if it match with "/api/:path*" and expect "/api/auth"', async () => {
    const request = new NextRequest('http://localhost:4242/api/notification');

    const renewedToken = await encode({
      secret: 'toRzXSUUBfVKp_hmDDhEpw-ujnkGepIpDkQplaTy',
      token: {
        accessToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNjRhNmE3MC05YWE4LTRmMzEtYTMwMC1hMzY2YzNhNzYxZDMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGhhdHBoYW1Ac3Ryb25ndGllLmNvbSIsImp0aSI6IjNmNTdlZmMwLWU0ZTgtNGRiOC1iOTEzLTIyY2Q5NGQ0ZmZkZiIsImJyYW5jaElkIjoiZjViMTY0ZDctMmM3MS00NGZjLTlkOGEtMjBiN2NiMTRjOTA3Iiwib3JnYW5pemF0aW9uSWQiOiIxZDRiZTllYi1jYjQwLTRkMzAtYWVhZS1hYjk5M2FjZmZlYTUiLCJlbXBsb3llZUlkIjoiMTBkOGE1ZmQtYWU5NS00YjRhLWFiYTUtMmUyYzczNzgxYzI4IiwicGVybWlzc2lvbnMiOlsiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlVGFzayIsIlRhc2tNYW5hZ2VtZW50LkFkbWluLk1hbmFnZUVtcGxveWVlIiwiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlUmVzb3VyY2UiLCJUYXNrTWFuYWdlbWVudC5BZG1pbi5NYW5hZ2VUaW1lIl0sImV4cCI6MTcwMDc5Njk5OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJdfQ.AgELVhHL93Qn_G2kMMWnLO5L576ceX7Wo-sdnD1ABV5W7PAC0PEaYL8AeDNEf51cVHKlaMO3KnW_ie8NK7Gn33_zwJRQuz_HCBtf2eN4SUoA9EllAgzwhKZYk0Dea377b061rAKBgITLiDuBHHqh6s5OGEjlZ728E4-IK-V3Eay8CEinASAlzCfhdMb0rPvgiTjaLOp5hq8SSaWqiV1J4uyryWYhTOR81gcUXXMeUk9PAIZfEmucJGNAG5bv3xyl3kQiCjnPy5jsZTxqUjthBtQhpCK1TzQkXZzvhUEm8wSpNpX7Od9AFEPUkGgGEa5b_WMG7zBuRPWmbuGj2Ptguw',
        refreshToken:
          'JJTB0tO7E7O9AbZRstFA3bEnc5ODjk8Xwlwe0I98GeQBMuEm/W+lokL7E767cxUDF6esLRFWEJmbVIAtNCDGsQ==',
        expiration: '2023-11-24T03:36:39+00:00',
        employeeId: '10d8a5fd-ae95-4b4a-aba5-2e2c73781c28',
        branchId: 'f5b164d7-2c71-44fc-9d8a-20b7cb14c907',
        organizationId: '1d4be9eb-cb40-4d30-aeae-ab993acffea5',
        role: 'Admin',
        routerPerms: ['/', '/task-management'],
        perms: [
          'TaskManagement.Admin.ManageTask',
          'TaskManagement.Admin.ManageEmployee',
          'TaskManagement.Admin.ManageResource',
          'TaskManagement.Admin.ManageTime',
        ],
        id: '064a6a70-9aa8-4f31-a300-a366c3a761d3',
        name: 'Phat Pham',
        email: 'phatpham@strongtie.com',
        image: '/images/rose.png',
        expiresAt: Date.now() + 60000,
        iat: 1700796385,
        exp: 1703388385,
        jti: '8954ddb1-b3ea-4da3-bb0f-91a95860083e',
      },
    });

    request.cookies.set(appConfigs.server.nextAuthName, renewedToken);

    const nextMock = jest.fn();

    const result = await withProxyApi(nextMock)(request, mockNextFetchEvent, {});

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('x-middleware-rewrite')).not.toBeNull();
  });

  test('should rewrite the request and attach authorization header if it match with "/api/:path*" and expect "/api/auth"', async () => {
    const request = new NextRequest('http://localhost:4242/api/notification');

    const renewedToken = await encode({
      secret: 'toRzXSUUBfVKp_hmDDhEpw-ujnkGepIpDkQplaTy',
      token: {
        accessToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNjRhNmE3MC05YWE4LTRmMzEtYTMwMC1hMzY2YzNhNzYxZDMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGhhdHBoYW1Ac3Ryb25ndGllLmNvbSIsImp0aSI6IjNmNTdlZmMwLWU0ZTgtNGRiOC1iOTEzLTIyY2Q5NGQ0ZmZkZiIsImJyYW5jaElkIjoiZjViMTY0ZDctMmM3MS00NGZjLTlkOGEtMjBiN2NiMTRjOTA3Iiwib3JnYW5pemF0aW9uSWQiOiIxZDRiZTllYi1jYjQwLTRkMzAtYWVhZS1hYjk5M2FjZmZlYTUiLCJlbXBsb3llZUlkIjoiMTBkOGE1ZmQtYWU5NS00YjRhLWFiYTUtMmUyYzczNzgxYzI4IiwicGVybWlzc2lvbnMiOlsiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlVGFzayIsIlRhc2tNYW5hZ2VtZW50LkFkbWluLk1hbmFnZUVtcGxveWVlIiwiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlUmVzb3VyY2UiLCJUYXNrTWFuYWdlbWVudC5BZG1pbi5NYW5hZ2VUaW1lIl0sImV4cCI6MTcwMDc5Njk5OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJdfQ.AgELVhHL93Qn_G2kMMWnLO5L576ceX7Wo-sdnD1ABV5W7PAC0PEaYL8AeDNEf51cVHKlaMO3KnW_ie8NK7Gn33_zwJRQuz_HCBtf2eN4SUoA9EllAgzwhKZYk0Dea377b061rAKBgITLiDuBHHqh6s5OGEjlZ728E4-IK-V3Eay8CEinASAlzCfhdMb0rPvgiTjaLOp5hq8SSaWqiV1J4uyryWYhTOR81gcUXXMeUk9PAIZfEmucJGNAG5bv3xyl3kQiCjnPy5jsZTxqUjthBtQhpCK1TzQkXZzvhUEm8wSpNpX7Od9AFEPUkGgGEa5b_WMG7zBuRPWmbuGj2Ptguw',
        refreshToken:
          'JJTB0tO7E7O9AbZRstFA3bEnc5ODjk8Xwlwe0I98GeQBMuEm/W+lokL7E767cxUDF6esLRFWEJmbVIAtNCDGsQ==',
        expiration: '2023-11-24T03:36:39+00:00',
        employeeId: '10d8a5fd-ae95-4b4a-aba5-2e2c73781c28',
        branchId: 'f5b164d7-2c71-44fc-9d8a-20b7cb14c907',
        organizationId: '1d4be9eb-cb40-4d30-aeae-ab993acffea5',
        role: 'Admin',
        routerPerms: ['/', '/task-management'],
        perms: [
          'TaskManagement.Admin.ManageTask',
          'TaskManagement.Admin.ManageEmployee',
          'TaskManagement.Admin.ManageResource',
          'TaskManagement.Admin.ManageTime',
        ],
        id: '064a6a70-9aa8-4f31-a300-a366c3a761d3',
        name: 'Phat Pham',
        email: 'phatpham@strongtie.com',
        image: '/images/rose.png',
        expiresAt: Date.now() - 60000,
        iat: 1700796385,
        exp: 1703388385,
        jti: '8954ddb1-b3ea-4da3-bb0f-91a95860083e',
      },
    });

    request.cookies.set(appConfigs.server.nextAuthName, renewedToken);

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
      expiration: Date.now() - 1000 * 1000, // Assuming token expires in 1 hour
    };
    // @ts-expect-error: IGNORE
    getToken = jest.fn().mockResolvedValueOnce(validToken);

    const nextMock = jest.fn();

    const result = await withProxyApi(nextMock)(request, mockNextFetchEvent, {});

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('x-middleware-rewrite')).not.toBeNull();
  });

  test('should rewrite the request if it match with "/api/:path*" and expect "/api/auth"', async () => {
    const request = new NextRequest('http://localhost:4242/api/notification');

    const nextMock = jest.fn();

    const result = await withProxyApi(nextMock)(request, mockNextFetchEvent, {});

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('x-middleware-rewrite')).not.toBeNull();
    expect(result?.headers.get('x-middleware-request-authorization')).toBeNull();
    expect(result?.headers.get('x-middleware-request-cookie')).toBeNull();
  });

  test('continues to the next middleware when the path is not match /api/:path* and expect /api/auth', async () => {
    const request = new NextRequest('http://localhost:4242/time-management');

    const renewedToken = await encode({
      secret: 'toRzXSUUBfVKp_hmDDhEpw-ujnkGepIpDkQplaTy',
      token: {
        accessToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNjRhNmE3MC05YWE4LTRmMzEtYTMwMC1hMzY2YzNhNzYxZDMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGhhdHBoYW1Ac3Ryb25ndGllLmNvbSIsImp0aSI6IjNmNTdlZmMwLWU0ZTgtNGRiOC1iOTEzLTIyY2Q5NGQ0ZmZkZiIsImJyYW5jaElkIjoiZjViMTY0ZDctMmM3MS00NGZjLTlkOGEtMjBiN2NiMTRjOTA3Iiwib3JnYW5pemF0aW9uSWQiOiIxZDRiZTllYi1jYjQwLTRkMzAtYWVhZS1hYjk5M2FjZmZlYTUiLCJlbXBsb3llZUlkIjoiMTBkOGE1ZmQtYWU5NS00YjRhLWFiYTUtMmUyYzczNzgxYzI4IiwicGVybWlzc2lvbnMiOlsiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlVGFzayIsIlRhc2tNYW5hZ2VtZW50LkFkbWluLk1hbmFnZUVtcGxveWVlIiwiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlUmVzb3VyY2UiLCJUYXNrTWFuYWdlbWVudC5BZG1pbi5NYW5hZ2VUaW1lIl0sImV4cCI6MTcwMDc5Njk5OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJdfQ.AgELVhHL93Qn_G2kMMWnLO5L576ceX7Wo-sdnD1ABV5W7PAC0PEaYL8AeDNEf51cVHKlaMO3KnW_ie8NK7Gn33_zwJRQuz_HCBtf2eN4SUoA9EllAgzwhKZYk0Dea377b061rAKBgITLiDuBHHqh6s5OGEjlZ728E4-IK-V3Eay8CEinASAlzCfhdMb0rPvgiTjaLOp5hq8SSaWqiV1J4uyryWYhTOR81gcUXXMeUk9PAIZfEmucJGNAG5bv3xyl3kQiCjnPy5jsZTxqUjthBtQhpCK1TzQkXZzvhUEm8wSpNpX7Od9AFEPUkGgGEa5b_WMG7zBuRPWmbuGj2Ptguw',
        refreshToken:
          'JJTB0tO7E7O9AbZRstFA3bEnc5ODjk8Xwlwe0I98GeQBMuEm/W+lokL7E767cxUDF6esLRFWEJmbVIAtNCDGsQ==',
        expiration: '2023-11-24T03:36:39+00:00',
        employeeId: '10d8a5fd-ae95-4b4a-aba5-2e2c73781c28',
        branchId: 'f5b164d7-2c71-44fc-9d8a-20b7cb14c907',
        organizationId: '1d4be9eb-cb40-4d30-aeae-ab993acffea5',
        role: 'Admin',
        routerPerms: ['/', '/task-management'],
        perms: [
          'TaskManagement.Admin.ManageTask',
          'TaskManagement.Admin.ManageEmployee',
          'TaskManagement.Admin.ManageResource',
          'TaskManagement.Admin.ManageTime',
        ],
        id: '064a6a70-9aa8-4f31-a300-a366c3a761d3',
        name: 'Phat Pham',
        email: 'phatpham@strongtie.com',
        image: '/images/rose.png',
        expiresAt: Date.now() + 60000,
        iat: 1700796385,
        exp: 1703388385,
        jti: '8954ddb1-b3ea-4da3-bb0f-91a95860083e',
      },
    });

    request.cookies.set(appConfigs.server.nextAuthName, renewedToken);
    const nextMock = jest.fn();

    const result = await withProxyApi(nextMock)(request, mockNextFetchEvent, {});

    expect(result).toBeUndefined();
    expect(nextMock).toHaveBeenCalled();
  });
});

describe('withAuthorization', () => {
  test('withAuthorization should return correctly', async () => {
    expect(withAuthorization).toBeTruthy();
  });

  test('should no need redirects to login page when no access token exists for public pages', async () => {
    const request = new NextRequest('http://localhost:4242/style-guide');

    const nextMock = jest.fn();

    const result = await withAuthorization(nextMock)(request, mockNextFetchEvent, {
      token: {} as JWT,
    });

    if (result) {
      expect(result?.status).toBe(200);
      expect(result.headers.get('Location')).toBe(null);
    }
  });

  test('redirects to login page when no access token exists for protected pages', async () => {
    const request = new NextRequest('http://localhost:4242/time-management');

    const nextMock = jest.fn();

    const result = await withAuthorization(nextMock)(request, mockNextFetchEvent, {});

    if (result) {
      expect(result).toBeInstanceOf(NextResponse);
      expect(result.status).toBe(307);
      expect(result.headers.get('Location')).toBe('http://localhost:4242/login');
    }
  });

  test('redirects to home page when access token exists for login page', async () => {
    const request = new NextRequest('http://localhost:4242/login');

    const renewedToken = await encode({
      secret: 'toRzXSUUBfVKp_hmDDhEpw-ujnkGepIpDkQplaTy',
      token: {
        accessToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNjRhNmE3MC05YWE4LTRmMzEtYTMwMC1hMzY2YzNhNzYxZDMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGhhdHBoYW1Ac3Ryb25ndGllLmNvbSIsImp0aSI6IjNmNTdlZmMwLWU0ZTgtNGRiOC1iOTEzLTIyY2Q5NGQ0ZmZkZiIsImJyYW5jaElkIjoiZjViMTY0ZDctMmM3MS00NGZjLTlkOGEtMjBiN2NiMTRjOTA3Iiwib3JnYW5pemF0aW9uSWQiOiIxZDRiZTllYi1jYjQwLTRkMzAtYWVhZS1hYjk5M2FjZmZlYTUiLCJlbXBsb3llZUlkIjoiMTBkOGE1ZmQtYWU5NS00YjRhLWFiYTUtMmUyYzczNzgxYzI4IiwicGVybWlzc2lvbnMiOlsiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlVGFzayIsIlRhc2tNYW5hZ2VtZW50LkFkbWluLk1hbmFnZUVtcGxveWVlIiwiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlUmVzb3VyY2UiLCJUYXNrTWFuYWdlbWVudC5BZG1pbi5NYW5hZ2VUaW1lIl0sImV4cCI6MTcwMDc5Njk5OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJdfQ.AgELVhHL93Qn_G2kMMWnLO5L576ceX7Wo-sdnD1ABV5W7PAC0PEaYL8AeDNEf51cVHKlaMO3KnW_ie8NK7Gn33_zwJRQuz_HCBtf2eN4SUoA9EllAgzwhKZYk0Dea377b061rAKBgITLiDuBHHqh6s5OGEjlZ728E4-IK-V3Eay8CEinASAlzCfhdMb0rPvgiTjaLOp5hq8SSaWqiV1J4uyryWYhTOR81gcUXXMeUk9PAIZfEmucJGNAG5bv3xyl3kQiCjnPy5jsZTxqUjthBtQhpCK1TzQkXZzvhUEm8wSpNpX7Od9AFEPUkGgGEa5b_WMG7zBuRPWmbuGj2Ptguw',
        refreshToken:
          'JJTB0tO7E7O9AbZRstFA3bEnc5ODjk8Xwlwe0I98GeQBMuEm/W+lokL7E767cxUDF6esLRFWEJmbVIAtNCDGsQ==',
        expiration: '2023-11-24T03:36:39+00:00',
        employeeId: '10d8a5fd-ae95-4b4a-aba5-2e2c73781c28',
        branchId: 'f5b164d7-2c71-44fc-9d8a-20b7cb14c907',
        organizationId: '1d4be9eb-cb40-4d30-aeae-ab993acffea5',
        role: 'Admin',
        routerPerms: ['/', '/task-management'],
        perms: [
          'TaskManagement.Admin.ManageTask',
          'TaskManagement.Admin.ManageEmployee',
          'TaskManagement.Admin.ManageResource',
          'TaskManagement.Admin.ManageTime',
        ],
        id: '064a6a70-9aa8-4f31-a300-a366c3a761d3',
        name: 'Phat Pham',
        email: 'phatpham@strongtie.com',
        image: '/images/rose.png',
        expiresAt: Date.now() + 60000,
        iat: 1700796385,
        exp: 1703388385,
        jti: '8954ddb1-b3ea-4da3-bb0f-91a95860083e',
      },
    });

    request.cookies.set(appConfigs.server.nextAuthName, renewedToken);

    const nextMock = jest.fn();

    const result = await withAuthorization(nextMock)(request, mockNextFetchEvent, {});

    if (result) {
      expect(result).toBeInstanceOf(NextResponse);
      expect(result.status).toBe(307);
      expect(result.headers.get('Location')).toBe('http://localhost:4242/');
    }
  });

  test('continues to the next middleware when access token exists for protected pages', async () => {
    const request = new NextRequest('http://localhost:4242/time-management');
    const renewedToken = await encode({
      secret: 'toRzXSUUBfVKp_hmDDhEpw-ujnkGepIpDkQplaTy',
      token: {
        accessToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNjRhNmE3MC05YWE4LTRmMzEtYTMwMC1hMzY2YzNhNzYxZDMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGhhdHBoYW1Ac3Ryb25ndGllLmNvbSIsImp0aSI6IjNmNTdlZmMwLWU0ZTgtNGRiOC1iOTEzLTIyY2Q5NGQ0ZmZkZiIsImJyYW5jaElkIjoiZjViMTY0ZDctMmM3MS00NGZjLTlkOGEtMjBiN2NiMTRjOTA3Iiwib3JnYW5pemF0aW9uSWQiOiIxZDRiZTllYi1jYjQwLTRkMzAtYWVhZS1hYjk5M2FjZmZlYTUiLCJlbXBsb3llZUlkIjoiMTBkOGE1ZmQtYWU5NS00YjRhLWFiYTUtMmUyYzczNzgxYzI4IiwicGVybWlzc2lvbnMiOlsiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlVGFzayIsIlRhc2tNYW5hZ2VtZW50LkFkbWluLk1hbmFnZUVtcGxveWVlIiwiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlUmVzb3VyY2UiLCJUYXNrTWFuYWdlbWVudC5BZG1pbi5NYW5hZ2VUaW1lIl0sImV4cCI6MTcwMDc5Njk5OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJdfQ.AgELVhHL93Qn_G2kMMWnLO5L576ceX7Wo-sdnD1ABV5W7PAC0PEaYL8AeDNEf51cVHKlaMO3KnW_ie8NK7Gn33_zwJRQuz_HCBtf2eN4SUoA9EllAgzwhKZYk0Dea377b061rAKBgITLiDuBHHqh6s5OGEjlZ728E4-IK-V3Eay8CEinASAlzCfhdMb0rPvgiTjaLOp5hq8SSaWqiV1J4uyryWYhTOR81gcUXXMeUk9PAIZfEmucJGNAG5bv3xyl3kQiCjnPy5jsZTxqUjthBtQhpCK1TzQkXZzvhUEm8wSpNpX7Od9AFEPUkGgGEa5b_WMG7zBuRPWmbuGj2Ptguw',
        refreshToken:
          'JJTB0tO7E7O9AbZRstFA3bEnc5ODjk8Xwlwe0I98GeQBMuEm/W+lokL7E767cxUDF6esLRFWEJmbVIAtNCDGsQ==',
        expiration: '2023-11-24T03:36:39+00:00',
        employeeId: '10d8a5fd-ae95-4b4a-aba5-2e2c73781c28',
        branchId: 'f5b164d7-2c71-44fc-9d8a-20b7cb14c907',
        organizationId: '1d4be9eb-cb40-4d30-aeae-ab993acffea5',
        role: 'Admin',
        routerPerms: ['/', '/task-management'],
        perms: [
          'TaskManagement.Admin.ManageTask',
          'TaskManagement.Admin.ManageEmployee',
          'TaskManagement.Admin.ManageResource',
          'TaskManagement.Admin.ManageTime',
        ],
        id: '064a6a70-9aa8-4f31-a300-a366c3a761d3',
        name: 'Phat Pham',
        email: 'phatpham@strongtie.com',
        image: '/images/rose.png',
        expiresAt: Date.now() + 60000,
        iat: 1700796385,
        exp: 1703388385,
        jti: '8954ddb1-b3ea-4da3-bb0f-91a95860083e',
      },
    });

    request.cookies.set(appConfigs.server.nextAuthName, renewedToken);
    const nextMock = jest.fn();

    const result = await withAuthorization(nextMock)(request, mockNextFetchEvent, {});

    expect(result).toBeUndefined();
    expect(nextMock).toHaveBeenCalled();
  });
});

describe('withRefreshToken', () => {
  test('withRefreshToken should return correctly', async () => {
    expect(withRefreshToken).toBeTruthy();
  });

  test('redirects to login page and deletes cookies when token refresh fails', async () => {
    const request = new NextRequest('http://localhost:4242/api/auth/session');

    const token = {
      accessToken: 'fake-access-token',
      expiresAt: Date.now() - 60000,
    };

    const nextMock = jest.fn();

    const error = new Error('error');

    (refreshToken as jest.Mock).mockRejectedValue(error);

    const data = { token };

    const result = await withRefreshToken(nextMock)(request, mockNextFetchEvent, data);

    if (result) {
      expect(result).toBeInstanceOf(NextResponse);
      expect(result.status).toBe(307);
      expect(result.headers.get('Location')).toBe('http://localhost:4242/login');
      expect((result as NextResponse).cookies.get('next-auth.cookie-name')).toBeUndefined();
    }
  });

  test('continues to the next middleware and includes token renewal when token refresh invalid', async () => {
    const request = new NextRequest('http://localhost:4242/api/auth/session');

    const token = {
      accessToken: 'fake-access-token',
      expiresAt: new Date(new Date().getTime() + 60000),
    };

    const nextMock = jest.fn();

    const data = { token };

    const result = await withRefreshToken(nextMock)(request, mockNextFetchEvent, data);

    expect(result).toBeUndefined();
    expect(nextMock).toHaveBeenCalledWith(request, mockNextFetchEvent, {
      token,
      renewedToken: undefined,
    });
  });

  test('continues to the next middleware and includes token renewal when token refresh invalid', async () => {
    const request = new NextRequest('http://localhost:4242/api/auth/session');

    const token = {
      accessToken: 'fake-access-token',
      expiresAt: Date.now() - 60000,
    };

    const renewedToken = {
      accessToken: 'new-accesstoken',
      expiresAt: 12345678910,
      refreshToken: 'new-refreshToken',
      expiration: 12345678910,
    };

    const nextMock = jest.fn();

    const data = { token };

    (refreshToken as jest.Mock).mockResolvedValue({ data: renewedToken });

    const result = await withRefreshToken(nextMock)(request, mockNextFetchEvent, data);

    expect(result).toBeUndefined();
    expect(nextMock).toHaveBeenCalled();
  });
});

describe('withPermissions', () => {
  test('withPermissions should return correctly', async () => {
    expect(withPermissions).toBeTruthy();
  });

  test('continues to the next middleware when the path is protected and permission is valid', async () => {
    const request = new NextRequest('http://localhost:4242/time-management');

    const data = { token: { routerPerms: ['/time-management', '/dashboard'] } };

    const nextMock = jest.fn();

    const result = await withPermissions(nextMock)(request, mockNextFetchEvent, data);

    expect(result).toBeInstanceOf(NextResponse);
  });

  test('rewrites to NO_PERMISSION page when the path is protected and permission is not valid', async () => {
    const request = new NextRequest('http://localhost:4242/time-management');

    const data = { token: { routerPerms: ['/'] } };

    const nextMock = jest.fn();

    const result = await withPermissions(nextMock)(request, mockNextFetchEvent, data);

    if (result) {
      expect(result).toBeInstanceOf(NextResponse);
      expect(result.status).toBe(200);
    }
  });

  test('sets the nextAuthCookie when renewedToken is provided', async () => {
    const request = new NextRequest('http://localhost:4242/time-management');

    const renewedToken = 'fake-encoded-token';
    const data = { token: { routerPerms: ['/time-management'] }, renewedToken };

    const nextMock = jest.fn();

    const result = await withPermissions(nextMock)(request, mockNextFetchEvent, data);

    if (result) {
      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).cookies.get(appConfigs.server.nextAuthName)).toEqual({
        name: appConfigs.server.nextAuthName,
        value: renewedToken,
        path: '/',
      });
    }
  });
});
