import appConfigs from '@esp/constants/config';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { encode, getToken } from 'next-auth/jwt';
import { JWT } from 'next-auth/jwt/types';

import { isTokenExpired, refreshAccessToken } from '../next-auth';
import { MiddlewareFactory } from './stack-middleware';

const withAPIProxy: MiddlewareFactory =
  (next) => async (req: NextRequest, _next: NextFetchEvent) => {
    if (!req.nextUrl.pathname.startsWith('/api')) {
      return next(req, _next, {});
    }

    let token = (await getToken({
      req,
      secret: appConfigs.server.nextAuthSecret,
      cookieName: appConfigs.server.nextAuthName,
    })) as JWT;

    let renewedToken;

    const requestHeaders = new Headers(req.headers);

    if (token) {
      if (isTokenExpired(token.expiresAt)) {
        token = (await refreshAccessToken(token, 'withAPIProxy')) as JWT;

        renewedToken = await encode({
          secret: appConfigs.server.nextAuthSecret,
          token,
        });
      }

      requestHeaders.set('Authorization', `Bearer ${token.accessToken}`);

      requestHeaders.set('employeeId', token.employeeId as string);
      requestHeaders.set('branchId', token.branchId as string);
      requestHeaders.set('organizationId', token.organizationId as string);
      requestHeaders.set('userId', token.id as string);

      requestHeaders.delete('cookie');
    }

    const serverAPIUrl = appConfigs.server.apiUrl;

    const response = NextResponse.rewrite(
      new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, serverAPIUrl),
      {
        request: { headers: requestHeaders },
      }
    );

    if (renewedToken) {
      response.cookies.set(appConfigs.server.nextAuthName, renewedToken);
    }

    return response;
  };

export default withAPIProxy;
