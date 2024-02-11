import { APP_ROUTE, PUBLIC_PATH } from '@esp/constants';
import appConfigs from '@esp/constants/config';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

import { MiddlewareData, MiddlewareFactory } from './stack-middleware';

const withPermissions: MiddlewareFactory =
  (next) => async (req: NextRequest, _next: NextFetchEvent, data: MiddlewareData) => {
    let response = NextResponse.next();

    const nextAuthCookieName = appConfigs.server.nextAuthName;

    const { token, renewedToken } = data;

    const { pathname } = req.nextUrl;

    const protectedPath = Object.values(APP_ROUTE).filter(
      (path) => !PUBLIC_PATH.includes(path)
    ) as string[];

    const matchesProtectedPath = protectedPath.includes(pathname);

    const isValidPerm = token?.routerPerms?.some((perm) => perm === pathname);

    if (matchesProtectedPath && !isValidPerm) {
      if (appConfigs.common.usePermission) {
        response = NextResponse.rewrite(new URL(APP_ROUTE.NO_PERMISSION, req.url));
      }
    }

    if (renewedToken) {
      response.cookies.set(nextAuthCookieName, renewedToken);
    }

    return response;
  };

export default withPermissions;
