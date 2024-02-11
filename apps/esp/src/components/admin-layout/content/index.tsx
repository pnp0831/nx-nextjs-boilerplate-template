'use client';

import { useAppContext } from '@esp/contexts/app-context';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import React from 'react';

type ContentProps = {
  children: React.ReactNode;
};

interface BoxComponentProps extends BoxProps {
  open?: boolean;
  sidebarOpenWidth: string;
  sidebarWidth: string;
}

const BoxComponent = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'open' && prop !== 'sidebarWidth' && prop !== 'sidebarOpenWidth',
})<BoxComponentProps>(({ theme, open, sidebarWidth, sidebarOpenWidth }) => ({
  color: theme.palette.common.black,
  padding: '2.25rem',
  paddingTop: '4.5rem',
  [theme.breakpoints.up('md')]: {
    paddingTop: '4.25rem',
  },
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#F2F2F2',
  marginLeft: sidebarWidth,
  ...(open && {
    marginLeft: sidebarOpenWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  [theme.breakpoints.down('md')]: {
    paddingLeft: '1rem',
    paddingRight: '1rem',
    marginLeft: 0,
  },
}));

const Content = ({ children }: ContentProps) => {
  const { sidebarOpen, sidebarWidth, sidebarOpenWidth } = useAppContext();

  return (
    <BoxComponent
      component="main"
      open={sidebarOpen}
      sidebarWidth={sidebarWidth}
      sidebarOpenWidth={sidebarOpenWidth}
      sx={{ minHeight: '100vh' }}
    >
      {children}
    </BoxComponent>
  );
};

export default Content;
