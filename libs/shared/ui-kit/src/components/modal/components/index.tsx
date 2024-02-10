import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

import { ESPModalProps } from '../type';

export const DialogComponent = styled(Dialog)<ESPModalProps>(({ theme }) => {
  return {
    '.MuiModal-backdrop': {
      backgroundColor: theme.palette.black_muted.main,
    },
    '.MuiPaper-root ': {
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    },
    '.MuiDialogTitle-root': {
      ...theme.typography.h4,
      padding: '0.75rem 1.25rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      button: {
        padding: 0,
      },
    },
    '.MuiDialogContent-root': {
      padding: '1.25rem 1.25rem 0 1.25rem',
      ...theme.typography.regular_l,
      borderBottom: 'none',
      color: theme.palette.common.black,
    },
    '.MuiDialogActions-root': {
      justifyContent: 'flex-end',
      padding: '1rem',
    },
  };
});

export const DialogTitleComponent = styled(DialogTitle)(() => {
  return {
    svg: {
      width: '1rem',
      height: '1rem',
    },
  };
});
