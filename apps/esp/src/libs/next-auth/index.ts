import { IResponseGenerateToken } from '@esp/apis/authorization';
import { generateToken, mockResponseGenerateToken, refreshToken } from '@esp/apis/authorization';
import { APP_ROUTE, REFRESH_TOKEN_ERROR } from '@esp/constants';
import appConfigs from '@esp/constants/config';
import { getRouterPermissions, handleMockData } from '@esp/utils/helper';
import jwt_decode from 'jwt-decode';
import loOmit from 'lodash/omit';
import type { AuthOptions } from 'next-auth/core/types';
import { JWT } from 'next-auth/jwt/types';
import OktaProvider from 'next-auth/providers/okta';

interface UserAccessToken {
  userId: string;
  exp: number;
  iss: string;
  aud: string;
  permissions: string[];
  employeeId: string;
  branchId: string;
  organizationId: string;
  positionName: string;
  [key: string]: unknown;
}

export const authOptions: AuthOptions = {
  providers: [
    OktaProvider({
      clientId: appConfigs.server.oktaClientId,
      clientSecret: appConfigs.server.oktaClientSecret,
      issuer: appConfigs.server.oktaIssuer,
      authorization: {
        // Oauth 2/ Oauth 1 need params with max_age (seconds)
        // The client application can use it to remember the state of its interaction with the end user at the time of the authentication call
        // [OAuth 2](https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/)
        // [OAuth 1](https://oauth.net/core/1.0a/#auth_step2)

        // Read more: https://developer.okta.com/docs/reference/api/oidc/#parameter-details
        // https://developer.okta.com/docs/reference/api/oidc/#request-parameters

        // 10 seconds for state of login / logout
        params: { max_age: 10 },
      },
    }),
  ],

  callbacks: {
    // 1st callback when singin okta success
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },

    // 2nd callback / callback session when call api "Session"
    // Explanation:
    // The Token refers to the same entity as the User.
    // The Account includes the access_token, expires_at, refresh_token, and id_token of the Okta Token.
    // For more information, please refer to: https://support.okta.com/help/s/question/0D51Y00006CHjMzSAL/how-can-you-adjust-the-expiration-date-of-a-jwt-token?language=en_US
    // User refers to the user in Okta.
    // Profile refers to the user's profile in Okta.
    async jwt({ token, account, profile, user, trigger }) {
      if (account) {
        // Handle call API to Identity Service to get SST Token

        let dataToken = {} as IResponseGenerateToken;

        try {
          const { data: responseGenerateToken } = await generateToken(
            account.access_token as string
          );

          dataToken = { ...responseGenerateToken };
        } catch (error) {
          console.log(
            'Error when generateToken (callback jwt)',
            appConfigs.common.useMockData,
            error
          );

          dataToken = handleMockData(mockResponseGenerateToken.data) as IResponseGenerateToken;
        } finally {
          if (dataToken) {
            const espUser: UserAccessToken = jwt_decode(dataToken.accessToken);

            const expiresAt = Math.floor(new Date(dataToken.expiration).getTime());

            token = {
              ...dataToken,
              employeeId: espUser.employeeId,
              branchId: espUser.branchId,
              organizationId: espUser.organizationId,
              role: espUser.positionName,
              routerPerms: [APP_ROUTE.HOME, ...getRouterPermissions(espUser.permissions)],
              perms: espUser.permissions,
              id: espUser.userId,
              name: user.name,
              email: user.email,
              image: user.image || '/images/rose.png',
              expiresAt,
            };
          }
        }
      }

      // Handle refresh token on client
      if (token.expiresAt && isTokenExpired(token.expiresAt)) {
        token = (await refreshAccessToken(token, 'callback jwt')) as JWT;
      }

      return token;
    },

    // 3rd callback session when call api "Session"
    // Explanation:
    // The Session refers to the same entity as the User.
    // The User is always undefined
    // Token is the jwt token as JWT callback
    async session({ session, token }) {
      if (token?.accessToken && token?.expiresAt) {
        // Override session

        session.user = loOmit(token, [
          'accessToken',
          'refreshToken',
          'expiration',
          'jti',
          'iat',
          'expiresAt',
          'exp',
        ]);
        session.error = token.error;
        session.expires = new Date(token.expiresAt).toISOString();
      }

      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export const refreshAccessToken = async (token: JWT, event?: string) => {
  try {
    const { data, status } = await refreshToken({
      refreshToken: token.refreshToken,
      accessToken: token.accessToken,
    });

    console.log('refreshAccessToken data', event, status, data);

    if (data?.expiration) {
      const expiresAt = Math.floor(new Date(data.expiration).getTime());

      token = {
        ...token,
        expiresAt,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiration: data.expiration,
      };

      return token;
    }

    return {
      ...token,
      error: REFRESH_TOKEN_ERROR,
    };
  } catch (error) {
    console.log('Error when refreshAccessToken', event, error);

    return {
      ...token,
      error: REFRESH_TOKEN_ERROR,
    };
  }
};

export const isTokenExpired = (exp: number) => exp < Date.now();
