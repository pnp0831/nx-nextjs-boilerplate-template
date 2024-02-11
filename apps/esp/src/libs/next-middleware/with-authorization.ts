import { APP_ROUTE, PUBLIC_PATH } from '@esp/constants';
import appConfigs from '@esp/constants/config';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { MiddlewareFactory } from './stack-middleware';

const withAuthorization: MiddlewareFactory =
  (next) => async (req: NextRequest, _next: NextFetchEvent) => {
    const { pathname } = req.nextUrl;

    const token = await getToken({
      req,
      secret: appConfigs.server.nextAuthSecret,
      cookieName: appConfigs.server.nextAuthName,
    });

    const matchesProtectedPath = !PUBLIC_PATH.includes(pathname);

    if (!token?.accessToken) {
      const res = !matchesProtectedPath
        ? // For the login or style guide pages, No need to execute the middleware to check permissions or refresh tokens.
          NextResponse.next()
        : // For protected pages, if the token does not exist, redirect the user to the login page.
          NextResponse.redirect(new URL(APP_ROUTE.LOGIN, req.url));

      if (matchesProtectedPath) {
        res.cookies.delete(appConfigs.server.nextAuthName);
      }

      return res;
    }

    // For login page, if the token does exist, redirect the user to home page.
    if (pathname === APP_ROUTE.LOGIN) {
      return NextResponse.redirect(new URL(APP_ROUTE.HOME, req.url));
    }

    // Token does exist and match PROTECTED PAGES
    return next(req, _next, { token });
  };

export default withAuthorization;
