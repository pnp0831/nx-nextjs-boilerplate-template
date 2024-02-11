import { ReactQueryClient } from '@esp/contexts/react-query-context';
import ThemeContextProvider from '@ui-kit/contexts/theme-context/index';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

import { AppRouterContextProviderMock } from './AppRouterContextProviderMock';
import { mockCommonUser } from './data-mock';

const ContextNeededWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <AppRouterContextProviderMock>
      <ThemeContextProvider>
        <ReactQueryClient>
          <SessionProvider
            session={{
              user: mockCommonUser,
              expires: new Date().toISOString(),
            }}
          >
            {children}
          </SessionProvider>
        </ReactQueryClient>
      </ThemeContextProvider>
    </AppRouterContextProviderMock>
  );
};

export default ContextNeededWrapper;
