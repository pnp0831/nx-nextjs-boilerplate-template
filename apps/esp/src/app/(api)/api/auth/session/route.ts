import { REFRESH_TOKEN_ERROR } from '@esp/constants';
import appConfigs from '@esp/constants/config';
import { authOptions } from '@esp/libs/next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { encode, getToken } from 'next-auth/jwt';

const sendResponse401ToClient = () => {
  const response = NextResponse.json(
    {
      message: `Unauthorized`,
      code: 401,
    },
    { status: 401 }
  );

  response.cookies.delete(appConfigs.server.nextAuthName);
  return response;
};

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: appConfigs.server.nextAuthSecret,
    cookieName: appConfigs.server.nextAuthName,
  });

  if (!token?.perms) {
    return sendResponse401ToClient();
  }

  // @ts-expect-error: IGNORE
  const updatedToken = await authOptions.callbacks.jwt({
    token,
  });

  if (updatedToken.error === REFRESH_TOKEN_ERROR) {
    return sendResponse401ToClient();
  }

  // @ts-expect-error: IGNORE
  const updatedSession = await authOptions.callbacks?.session({
    token: updatedToken,
    session: {
      user: {
        name: token.name,
        email: token.email,
        image: token.image,
      },
      expires: token.expiration,
    },
  });

  const tokenEncode = await encode({
    secret: appConfigs.server.nextAuthSecret,
    token: updatedToken,
  });

  const response = NextResponse.json(updatedSession);

  response.cookies.set(appConfigs.server.nextAuthName, tokenEncode);

  return response;
}
