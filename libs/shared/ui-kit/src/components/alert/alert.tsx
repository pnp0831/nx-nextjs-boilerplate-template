'use client';

import { AlertProps } from '@mui/material/Alert';
import React from 'react';

import { AlertComponent } from './components';

type Ref =
  | ((instance: HTMLDivElement | null) => void)
  | React.RefObject<HTMLDivElement>
  | null
  | undefined;

export const ESPAlert = React.forwardRef((props: AlertProps, ref: Ref) => {
  return (
    <AlertComponent
      ref={ref}
      icon={false}
      {...props}
      onClose={(event: React.SyntheticEvent<Element, Event>) => {
        if (typeof props.onClose === 'function') {
          props.onClose(event);
        }
      }}
    >
      {props.children}
    </AlertComponent>
  );
});

ESPAlert.displayName = 'ESPAlert';

export default ESPAlert;
