import '../styles/global.scss';

import GoogleAnalyze from '@esp/components/google-analyze';
import appConfigs from '@esp/constants/config';
import { AppClientConfigProvider } from '@esp/contexts/app-client-config-context';
import { AuthContextProvider } from '@esp/contexts/auth-context';
import { ReactQueryClient } from '@esp/contexts/react-query-context';
import { authOptions } from '@esp/libs/next-auth';
import ThemeContextProvider from '@ui-kit/contexts/theme-context';
import pick from 'lodash/pick';
import { getServerSession } from 'next-auth';

export const metadata = {
  title: 'Enterprise Service Platform',
  description: 'Enterprise Service Platform ( ESP )',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const appClientConfig = pick(appConfigs, ['client', 'common']);

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/images/logo.png" />
      </head>
      <body>
        {/* TODO: REMOVE when BE transfer to https */}
        {appConfigs.server.needToUseContentSecurity && (
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        )}
        <GoogleAnalyze />
        {appConfigs.client.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${appConfigs.client.gtmId}`}
              height={0}
              width={0}
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <AppClientConfigProvider appConfigs={appClientConfig}>
          <ThemeContextProvider>
            <AuthContextProvider session={session}>
              <ReactQueryClient>{children}</ReactQueryClient>
            </AuthContextProvider>
          </ThemeContextProvider>
        </AppClientConfigProvider>
      </body>
    </html>
  );
}
