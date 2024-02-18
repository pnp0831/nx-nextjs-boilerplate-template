import { APP_ROUTE, PUBLIC_PATH, REFRESH_TOKEN_ERROR } from '@esp/constants';
import appConfigs from '@esp/constants/config';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { encode, getToken } from 'next-auth/jwt';

import { isTokenExpired, refreshAccessToken } from '../next-auth';
import { MiddlewareFactory } from './stack-middleware';

const withAuth: MiddlewareFactory = (next) => async (req: NextRequest, _next: NextFetchEvent) => {
  const { pathname } = req.nextUrl;
  const cookieName = appConfigs.server.nextAuthName;

  const token = await getToken({
    req,
    secret: appConfigs.server.nextAuthSecret,
    cookieName,
  });

  let renewedToken;

  // Refresh Token
  if (token && isTokenExpired(token.expiresAt)) {
    const newToken = await refreshAccessToken(token, `withAuth - ${req.nextUrl.pathname}`);

    if (newToken.error === REFRESH_TOKEN_ERROR) {
      const response = NextResponse.redirect(new URL(APP_ROUTE.LOGIN, req.url));

      response.cookies.delete(cookieName);
      return response;
    }

    renewedToken = await encode({
      secret: appConfigs.server.nextAuthSecret,
      token: newToken,
    });
  }

  const matchesProtectedPath = !PUBLIC_PATH.includes(pathname);

  // Token doesnt exist and match PROTECTED PAGES
  if (!token?.accessToken && matchesProtectedPath) {
    const response = NextResponse.redirect(new URL(APP_ROUTE.LOGIN, req.url));
    response.cookies.delete(cookieName);
    return response;
  }

  // For login page, if the token does exist, redirect the user to home page.
  if (token && pathname === APP_ROUTE.LOGIN) {
    const response = NextResponse.redirect(new URL(APP_ROUTE.HOME, req.url));

    if (renewedToken) {
      response.cookies.set(cookieName, renewedToken);
    }

    return response;
  }

  // Token does exist and match PROTECTED PAGES -> next withPermission
  return next(req, _next, { token, renewedToken });
};

export default withAuth;
