import Button from '@mui/material/Button';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

import { ESPButtonProps } from '../type';

export const IconButtonComponent = styled(IconButton)<IconButtonProps>(
  ({ theme, color, size = 'medium' }) => {
    const styles = {
      large: {
        height: '2.5rem',
        width: '2.5rem',
        ...theme.typography.bold_l,
        svg: {
          width: '1em',
          height: '1em',
        },
      },
      medium: {
        height: '2rem',
        width: '2rem',
        ...theme.typography.bold_m,
        svg: {
          width: '0.9em',
          height: '0.9em',
        },
      },
      small: {
        height: '1.5rem',
        width: '1.5rem',
        ...theme.typography.bold_s,
        svg: {
          width: '0.8em',
          height: '0.8em',
        },
      },
    }[size];

    return {
      ...styles,
      minWidth: 'unset',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '0.25rem',
      color: theme.palette.common.white,
      '&:hover': {
        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
        // filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))',
        backgroundColor:
          color === 'secondary' ? theme.palette.secondary.main : theme.palette.primary.main,
      },
    };
  }
);

export const ButtonComponent = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'loading',
})<ESPButtonProps>(({ theme, size = 'medium', color = 'primary', loading }) => {
  const styles = {
    large: {
      height: '2.5rem',
      ...theme.typography.bold_l,
      padding: '0.5rem 1rem',
    },
    medium: {
      height: '2rem',
      ...theme.typography.bold_m,
      padding: '0.5rem 0.75rem',
    },
    small: {
      height: '1.5rem',
      ...theme.typography.bold_s,
      padding: '0.5rem 0.25rem',
    },
  }[size];

  const loadingStyle = {
    color: loading
      ? 'rgba(255, 255, 255, 0.6)'
      : color === 'secondary'
      ? theme.palette.common.black
      : 'white',
  };

  return {
    textTransform: 'capitalize',
    borderRadius: '0.25rem',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
      // filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))',
      backgroundColor: theme.palette[color].main,
    },
    ...styles,
    ...loadingStyle,
    '&.Mui-disabled': {
      backgroundColor: theme.palette.gray_dark.main,
    },
    '.MuiCircularProgress-root': {
      color: 'rgba(255, 255, 255, 0.6)',
      marginRight: '0.5rem',
    },
    '&.Mui-loading': {
      userSelect: 'none',
      cursor: 'not-allowed',
      '&:hover': {
        filter: 'none',
      },
    },
  };
});
