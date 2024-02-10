import Alert, { AlertProps } from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

export const AlertComponent = styled(Alert)<AlertProps>(({ theme, severity }) => {
  const backgroundColor = {
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    success: theme.palette.success.main,
    info: '#333333',
  }[severity as string];

  return {
    color: 'white',
    backgroundColor,
    padding: '0.75rem 1rem',
    '.MuiAlert-message': {
      padding: 0,
      ...theme.typography.regular_l,
    },
    '.MuiAlert-action': {
      paddingTop: '0.1rem',
      paddingRight: '0.25rem',
      button: {
        padding: 0,
        color: theme.palette.common.white,
      },
    },
  };
});
