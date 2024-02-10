interface ServerConfig {
  oktaClientId: string;
  oktaClientSecret: string;
  oktaIssuer: string;

  nextAuthSecret: string;
  nextAuthName: string;
  nextAuthUrl: string;

  apiUrl: string;

  needToUseContentSecurity: boolean;
}

export interface CommonConfig {
  useMockData: boolean;
  usePermission: boolean;
}

export interface Configs {
  server: ServerConfig;
  client: ClientConfig;
  common: CommonConfig;
}

export interface ClientConfig {
  gtmId: string;
  measurementId: string;
  apiUrl: string;
  hideTimePolicy: boolean;
}

export type AppClientConfigs = Pick<Configs, 'client' | 'common'>;

const appConfigs: Configs = {
  common: {
    useMockData: Boolean(process.env.NEED_TO_USE_MOCK_DATA === '1'),
    usePermission: Boolean(process.env.NEED_TO_USE_PERMISSION === '1'),
  },
  server: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET as string,
    nextAuthUrl: process.env.NEXTAUTH_URL as string,
    nextAuthName: process.env.NEXTAUTH_URL?.startsWith('https://')
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
    oktaClientId: process.env.OKTA_CLIENT_ID as string,
    oktaClientSecret: process.env.OKTA_CLIENT_SECRET as string,
    oktaIssuer: process.env.OKTA_CLIENT_ISSUER as string,
    apiUrl: process.env.API_URL as string,
    needToUseContentSecurity: Boolean(process.env.NEED_TO_USE_CONTENT_SECURITY === '1'),
  },
  client: {
    gtmId: process.env.GG_GTM_ID as string,
    measurementId: process.env.GG_GTM_ID as string,
    apiUrl: process.env.API_URL as string,
    hideTimePolicy: Boolean(process.env.NEED_TO_HIDE_TIME_POLICY === '1'),
  },
};

export default appConfigs;
