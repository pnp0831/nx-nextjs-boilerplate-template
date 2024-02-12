import { DialogProps } from '@mui/material/Dialog';
import { ReactNode } from 'react';

export interface ESPModalProps extends Omit<DialogProps, 'title' | 'onClose'> {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: (reason?: TReasonOnClose) => void;
  hideCloseIcon?: boolean;
  closeIcon?: ReactNode;
}

export type TReasonOnClose = 'backdropClick' | 'escapeKeyDown';
