'use client';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface IAppContext {
  toggleSidebar: () => void;
  toggleSidebarMobile: () => void;
  sidebarWidth: string;
  sidebarOpenWidth: string;
  sidebarOpen: boolean;
  sidebarMobileOpen: boolean;
  refHeader?: unknown;
}

type AppContextProps = {
  children: ReactNode;
};

const SIDEBAR_WIDTH = '4.625rem';
const SIDEBAR_OPEN_WIDTH = '15rem';

const AppContext = React.createContext<IAppContext>({
  toggleSidebar: () => {},
  toggleSidebarMobile: () => {},
  sidebarOpen: true,
  sidebarMobileOpen: false,
  sidebarWidth: SIDEBAR_WIDTH,
  sidebarOpenWidth: SIDEBAR_WIDTH,
});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: AppContextProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  const toggleSidebarMobile = useCallback(() => {
    setSidebarMobileOpen(!sidebarMobileOpen);
  }, [sidebarMobileOpen]);

  const theme = useTheme();

  const screenDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (screenDesktop && sidebarMobileOpen) {
      setSidebarMobileOpen(false);
    }
  }, [screenDesktop, sidebarMobileOpen]);

  return (
    <AppContext.Provider
      value={{
        toggleSidebar,
        toggleSidebarMobile,
        sidebarOpen,
        sidebarMobileOpen,
        sidebarWidth: SIDEBAR_WIDTH,
        sidebarOpenWidth: SIDEBAR_OPEN_WIDTH,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
