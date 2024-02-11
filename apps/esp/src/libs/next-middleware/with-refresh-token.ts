import { APP_ROUTE, REFRESH_TOKEN_ERROR } from '@esp/constants';
import appConfigs from '@esp/constants/config';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { encode } from 'next-auth/jwt';

import { isTokenExpired, refreshAccessToken } from '../next-auth';
import { MiddlewareData, MiddlewareFactory } from './stack-middleware';

const withRefreshToken: MiddlewareFactory =
  (next) => async (req: NextRequest, _next: NextFetchEvent, data: MiddlewareData) => {
    const { token } = data;

    let renewedToken;

    if (token && isTokenExpired(token.expiresAt)) {
      const newToken = await refreshAccessToken(
        token,
        `withRefreshToken - ${req.nextUrl.pathname}`
      );

      if (newToken.error === REFRESH_TOKEN_ERROR) {
        const response = NextResponse.redirect(new URL(APP_ROUTE.LOGIN, req.url));
        const nextAuthCookieName = appConfigs.server.nextAuthName;
        response.cookies.delete(nextAuthCookieName);
        return response;
      }

      renewedToken = await encode({
        secret: appConfigs.server.nextAuthSecret,
        token: newToken,
      });
    }

    return next(req, _next, { token, renewedToken });
  };

export default withRefreshToken;
