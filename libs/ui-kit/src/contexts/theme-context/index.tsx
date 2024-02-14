'use client';

import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppRouterCacheProvider,
  AppRouterCacheProviderProps,
} from '@mui/material-nextjs/v14-appRouter';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useMemo } from 'react';

import { theme } from '../../theme/index';
import { NotifyContextProvider } from '../notify-context';

dayjs.extend(isBetweenPlugin);
dayjs.extend(isSameOrBefore);

type ThemeContextProps = AppRouterCacheProviderProps;

export const ThemeContextProvider = ({ children, options }: ThemeContextProps) => {
  return (
    <AppRouterCacheProvider
      options={{
        ...options,
        prepend: true,
      }}
    >
      <ThemeProvider theme={theme}>
        <NotifyContextProvider>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
        </NotifyContextProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default ThemeContextProvider;
