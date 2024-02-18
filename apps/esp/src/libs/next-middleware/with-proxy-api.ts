import appConfigs from '@esp/constants/config';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { JWT } from 'next-auth/jwt';

import { MiddlewareData, MiddlewareFactory } from './stack-middleware';

const withAPIProxy: MiddlewareFactory =
  (next) => async (req: NextRequest, _next: NextFetchEvent, data: MiddlewareData) => {
    const { pathname, search } = req.nextUrl;

    let { token } = data;
    const { renewedToken } = data;
    token = { ...token } as JWT;

    if (!pathname.startsWith('/api')) {
      return next(req, _next, { token, renewedToken });
    }

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set('Authorization', `Bearer ${token.accessToken}`);
    requestHeaders.set('employeeId', token.employeeId as string);
    requestHeaders.set('branchId', token.branchId as string);
    requestHeaders.set('organizationId', token.organizationId as string);
    requestHeaders.set('userId', token.id as string);
    requestHeaders.delete('cookie');

    const serverAPIUrl = appConfigs.server.apiUrl;

    const response = NextResponse.rewrite(new URL(`${pathname}${search}`, serverAPIUrl), {
      request: { headers: requestHeaders },
    });

    if (renewedToken) {
      response.cookies.set(appConfigs.server.nextAuthName, renewedToken);
    }

    return response;
  };

export default withAPIProxy;
