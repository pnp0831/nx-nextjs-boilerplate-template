import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { JWT } from 'next-auth/jwt/types';

// Preferred approach: reacthustle.com/blog/how-to-chain-multiple-middleware-functions-in-nextjs
export interface MiddlewareData {
  token?: JWT | null;
  renewedToken?: string;
}

export declare type NextMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
  data: MiddlewareData
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export interface MiddlewareData {
  token?: JWT | null;
  response?: NextResponse;
}

function stackMiddlewares(functions: MiddlewareFactory[], index = 0): NextMiddleware {
  const current = functions[index];

  if (current) {
    const next = stackMiddlewares(functions, index + 1);
    return current(next);
  }

  return () => NextResponse.next();
}

export default stackMiddlewares;
