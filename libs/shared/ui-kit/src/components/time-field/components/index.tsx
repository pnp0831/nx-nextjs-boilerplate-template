import { styled } from '@mui/material/styles';
import { TimeField } from '@mui/x-date-pickers';

import { ESPTimeFieldProps } from '../type';

export const TimeFieldComponent = styled(({ size, ...props }: ESPTimeFieldProps) => (
  <TimeField {...props} />
))(({ theme, size = 'medium', error }) => {
  const styles = {
    large: {
      height: '2.5rem',
      ...theme.typography.regular_l,
      input: {
        padding: '0.5rem 0.75rem',
      },
      '.MuiInputAdornment-positionEnd': {
        paddingRight: '0.5rem',
      },
    },
    medium: {
      height: '2rem',
      ...theme.typography.regular_m,
      input: {
        padding: '0.5rem 0.75rem',
      },
      '.MuiInputAdornment-positionEnd': {
        paddingRight: '0.5rem',
      },
    },
    small: {
      height: '1.5rem',
      ...theme.typography.regular_s,
      input: {
        padding: '0.25rem 0.5rem',
      },
      '.MuiInputAdornment-positionEnd': {
        paddingRight: '0.25rem',
      },
    },
  }[size];

  return {
    width: '100%',
    '.MuiInputBase-root': {
      ...styles,
      backgroundColor: theme.palette.gray_light.main,
      fieldset: {
        borderColor: theme.palette.gray_medium.main,
      },
      '&:hover fieldset': {
        borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
      },

      '&.Mui-disabled': {
        fieldset: {
          borderColor: theme.palette.gray_medium.main,
        },
      },
    },
  };
});
