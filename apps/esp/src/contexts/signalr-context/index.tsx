'use client';

import { getNotificationHubUrl } from '@esp/apis/notification';
import useAuth from '@esp/hooks/useAuth';
import { IMessages } from '@esp/libs/microsoft-signalR';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAppClientConfig } from '../app-client-config-context';
import { ModalType } from '../import-export-notifier-context';

export interface ISignalRMessages {
  downloadAttachmentUrl?: string;
  isSuccess: boolean;
  message: string;
  type: ModalType;
  userId: string;
  id: string;
  progressId: string;
}

interface ISignalRContext {
  signalRConnection: HubConnection | null;
}

type SignalRContextProps = {
  children: ReactNode;
};

const SignalRContext = React.createContext<ISignalRContext>({
  signalRConnection: null,
});

export const useSignalRContext = () => useContext(SignalRContext);

export const SignalRContextProvider = ({ children }: SignalRContextProps) => {
  const { appConfigs } = useAppClientConfig();

  const { user } = useAuth();
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const userId = useMemo(() => user?.id, [user?.id]);

  const start = useCallback(async (connection: HubConnection) => {
    try {
      await connection.start();
    } catch (err) {
      console.log('SignalR Error', err);
      // setTimeout(start, 5000);
    }
  }, []);

  useEffect(() => {
    if (userId && appConfigs?.client?.apiUrl) {
      const signalRConnection = new HubConnectionBuilder()
        .withUrl(getNotificationHubUrl(appConfigs?.client.apiUrl, userId), {
          withCredentials: false,
          timeout: 10000,
          // TODO: REMOVE when BE transfer to https
          // transport: HttpTransportType.WebSockets,
          // skipNegotiation: true,
        })

        .configureLogging(LogLevel.Information)
        .build();

      start(signalRConnection);

      setConnection(signalRConnection);

      signalRConnection.on('Notification', (message: IMessages) => {
        console.log('Receive Notification Message', { message });
      });
    }
  }, [userId, start, appConfigs?.client?.apiUrl]);

  const signalRConnection = useMemo(() => connection, [connection]);

  return (
    <SignalRContext.Provider
      value={{
        signalRConnection,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};
