import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { CSSProperties } from 'react';

import { ESPInputProps } from '../type';

export const OutlinedInputComponent = styled(
  ({ size, ...props }: ESPInputProps) => <OutlinedInput {...props} />,
  {
    shouldForwardProp: (prop) => prop !== 'success' && prop !== 'errorMessage',
  }
)(({ theme, success, error, size = 'large', multiline }) => {
  let styles: { input?: unknown; [key: string]: unknown } = {};
  const inputStyles: { input: CSSProperties } = { input: {} };

  const isHasState = success || error;

  if (!multiline) {
    styles = {
      large: {
        height: '2.5rem',
        ...theme.typography.regular_l,
        input: {
          padding: '0.5rem 0.75rem',
        },
        '&.MuiInputBase-adornedStart': {
          paddingLeft: '0.75rem',
        },
        '&.MuiInputBase-adornedEnd': {
          paddingRight: '0.75rem',
        },
      },
      medium: {
        height: '2rem',
        ...theme.typography.regular_m,
        input: {
          padding: '0.5rem 0.625rem',
        },
        '&.MuiInputBase-adornedStart': {
          paddingLeft: '0.625rem',
        },
        '&.MuiInputBase-adornedEnd': {
          paddingRight: '0.625rem',
        },
      },
      small: {
        height: '1.5rem',
        ...theme.typography.regular_s,
        input: {
          padding: '0.25rem 0.5rem',
        },
        '&.MuiInputBase-adornedStart': {
          paddingLeft: '0.5rem',
        },
        '&.MuiInputBase-adornedEnd': {
          paddingRight: '0.5rem',
        },
      },
    }[size];

    inputStyles.input = styles.input as CSSProperties;

    if (!isHasState) {
      styles = {
        ...styles,
        '&.MuiInputBase-adornedStart svg, &.MuiInputBase-adornedEnd svg': {
          color: theme.palette.common.black,
        },
      };
    }
  } else {
    styles = {
      ...theme.typography.regular_l,
      padding: '0.5rem 0.75rem',
    };
  }

  return {
    '.MuiInputBase-inputAdornedStart': {
      paddingLeft: 0,
    },
    '.MuiInputBase-inputAdornedEnd': {
      paddingRight: 0,
    },
    backgroundColor: theme.palette.gray_light.main,
    '&.MuiInputBase-root': {
      fieldset: {
        borderRadius: '0.25rem',
        border: `1px solid ${
          success ? theme.palette.success.main : theme.palette.gray_medium.main
        }`,
        borderWidth: success || error ? '0.125rem' : '0.0625rem',
      },
      '&:hover fieldset': {
        borderColor: success
          ? theme.palette.success.main
          : error
          ? theme.palette.error.main
          : theme.palette.primary.main,
      },
      '&.Mui-disabled fieldset, &:hover&.Mui-disabled fieldset': {
        borderColor: theme.palette.gray_medium.main,
      },
    },
    '.MuiSvgIcon-root, .MuiIconButton-root': {
      width: '1.5em',
      height: '1.5em',
      fontSize: 'unset',
    },
    '&.Mui-disabled': {
      '&.Mui-disabled input, &.Mui-disabled .MuiInputAdornment-root': {
        cursor: 'not-allowed',
        svg: {
          color: 'rgba(0, 0, 0, 0.38)',
        },
      },
    },
    ...styles,
    input: {
      ...inputStyles,
      color: theme.palette.common.black,
      '::placeholder, :-ms-input-placeholder, ::-ms-input-placeholder': {
        color: theme.palette.black_muted.main,
        opacity: 1,
      },
    },
  };
});
