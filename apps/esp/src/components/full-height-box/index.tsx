'use client';

import { styled } from '@mui/material/styles';
import React, { memo, ReactNode } from 'react';

export const BoxComponent = styled('div', { shouldForwardProp: (prop) => prop !== 'background' })<{
  background?: string;
}>(({ background = 'white' }) => ({
  minHeight: 'calc(100vh - 13.375rem)',
  background,
  boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
  borderBottomRightRadius: '0.5rem',
  borderBottomLeftRadius: '0.5rem',
}));

const FullHeightBox = memo(
  ({ children, background = 'white' }: { children: ReactNode; background?: string }) => {
    return <BoxComponent background={background}>{children}</BoxComponent>;
  }
);

FullHeightBox.displayName = 'FullHeightBox';

export default FullHeightBox;
