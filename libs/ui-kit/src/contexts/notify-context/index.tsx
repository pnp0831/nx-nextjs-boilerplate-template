'use client';

import { AlertColor } from '@mui/material/Alert';
import {
  closeSnackbar,
  enqueueSnackbar,
  SharedProps,
  SnackbarProvider,
  VariantType,
} from 'notistack';
import React, { ReactNode, useCallback, useContext } from 'react';

import { ESPAlert } from '../../components/alert/alert';
import { getErrorMessages } from '../../helpers';

export interface IError {
  errorCode: string | number;
  message: string;
  detail: string;
}

type IErrorMessageFromBE = IError[];

type SnackbarContextProviderProps = {
  children: ReactNode;
};

interface Options extends SharedProps {
  variant: VariantType;
}

export type MessageError = IErrorMessageFromBE | Error | string | unknown;

interface ISnackbarContext {
  notifySuccess: (message: string | ReactNode, option?: Options) => void;
  notifyError: (message: MessageError, option?: Options) => void;
  hideNotify: () => void;
}

const SnackbarContext = React.createContext<ISnackbarContext>({
  hideNotify: () => {},
  notifySuccess: (message: string | ReactNode) => {},
  notifyError: (message: MessageError) => {},
});

export const useNotify = () => useContext(SnackbarContext);

export const NotifyContextProvider = ({ children }: SnackbarContextProviderProps) => {
  const hideNotify = useCallback(() => {}, []);

  const notifySuccess = useCallback((message: string | ReactNode, option?: Options) => {
    option = {
      variant: 'success',
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'bottom',
      },
      autoHideDuration: 5000,
      ...option,
    };

    const { variant, anchorOrigin, autoHideDuration } = option;

    enqueueSnackbar(message, {
      variant,
      anchorOrigin,
      autoHideDuration,
      content: (key, message) => {
        return (
          <ESPAlert
            severity={variant as AlertColor}
            onClose={() => closeSnackbar(key)}
            sx={{
              maxWidth: '35vw',
            }}
          >
            {message}
          </ESPAlert>
        );
      },
    });
  }, []);

  const notifyError = useCallback((messages: MessageError, option?: Options) => {
    option = {
      variant: 'error',
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'bottom',
      },
      autoHideDuration: 5000,
      ...option,
    };

    const errorMessage = getErrorMessages(messages);

    const { variant, anchorOrigin, autoHideDuration } = option;

    enqueueSnackbar(errorMessage, {
      variant,
      anchorOrigin,
      autoHideDuration,
      content: (key, message) => {
        return (
          <ESPAlert
            severity={variant as AlertColor}
            onClose={() => closeSnackbar(key)}
            sx={{
              maxWidth: '35vw',
            }}
          >
            {errorMessage}
          </ESPAlert>
        );
      },
    });
  }, []);

  return (
    <SnackbarContext.Provider value={{ hideNotify, notifySuccess, notifyError }}>
      <SnackbarProvider maxSnack={5}>{children}</SnackbarProvider>
    </SnackbarContext.Provider>
  );
};

export default NotifyContextProvider;
