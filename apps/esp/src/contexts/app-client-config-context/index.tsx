'use client';

import { AppClientConfigs } from '@esp/constants/config';
import React, { ReactNode, useContext } from 'react';

interface IAppClientConfig {
  appConfigs: AppClientConfigs;
}

type AppClientConfigProps = {
  children: ReactNode;
  appConfigs: AppClientConfigs;
};

const AppClientConfig = React.createContext<IAppClientConfig>({
  appConfigs: {
    client: {
      gtmId: '',
      measurementId: '',
      apiUrl: '',
      hideTimePolicy: false,
    },
    common: { useMockData: false, usePermission: false },
  },
});

export const useAppClientConfig = () => useContext(AppClientConfig);

export const AppClientConfigProvider = ({ children, appConfigs }: AppClientConfigProps) => {
  return (
    <AppClientConfig.Provider
      value={{
        appConfigs,
      }}
    >
      {children}
    </AppClientConfig.Provider>
  );
};
