import { getNotificationHubUrl } from '@esp/apis/notification';
import { useAppClientConfig } from '@esp/contexts/app-client-config-context';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useCallback, useEffect, useRef, useState } from 'react';

// import { getServerApiUrl } from '@esp/utils/helper';

export interface ISignalRHandler {
  userId: string;
  employyee?: string;
  onReceiveMessage: ({ message }: { message: IMessages }) => void;
}

export type IMessagesType = 'Attendance Log Export' | 'Time Log Import';

export interface IMessages {
  downloadAttachmentUrl?: string;
  isSuccess: boolean;
  message: IMessagesType;
  type: IMessagesType;
  userId: string;
}

const SignalRHandler = ({ userId, onReceiveMessage }: ISignalRHandler) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const refIsReady = useRef(false);

  const { appConfigs } = useAppClientConfig();

  useEffect(() => {
    if (userId && appConfigs.client?.apiUrl) {
      const signalRConnection = new HubConnectionBuilder()
        .withUrl(getNotificationHubUrl(appConfigs.client?.apiUrl, userId), {
          withCredentials: false,
          timeout: 10000,
        })
        .configureLogging(LogLevel.Information)
        .build();

      setConnection(signalRConnection);
    }
  }, [appConfigs.client?.apiUrl, userId]);

  const start = useCallback(async (connection: HubConnection) => {
    try {
      await connection.start();
    } catch (err) {
      console.log('SignalR Error', err);
      // setTimeout(start, 5000);
    }
  }, []);

  const connectionHandler = useCallback(
    async (connection: HubConnection) => {
      // For notification
      connection.on('Notification', (message: IMessages) => {
        console.log('Receive Notification Message', { message });
        onReceiveMessage({ message });
      });
    },
    [onReceiveMessage]
  );

  useEffect(() => {
    if (connection && !refIsReady.current) {
      refIsReady.current = true;
      start(connection);

      connectionHandler(connection);
    }
  }, [connection, connectionHandler, start]);

  return null;
};

export default SignalRHandler;
