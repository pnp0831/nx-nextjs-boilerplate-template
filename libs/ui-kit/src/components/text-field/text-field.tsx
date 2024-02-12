'use client';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import React from 'react';

import { ESPTooltip } from '../tooltip';
import { ESPTextFieldProps } from './type';

const TextFieldComponent = styled(
  ({ size, ...props }: ESPTextFieldProps) => <TextField {...props} />,
  { shouldForwardProp: (prop) => prop !== 'success' && prop !== 'errorMessage' }
)(({ theme, size = 'medium', success, error }) => {
  const styles = {
    large: {
      '.MuiInputBase-root.MuiOutlinedInput-root': {
        paddingTop: '0.1rem',
        paddingBottom: '0.1rem',
        'input.MuiAutocomplete-input': {
          ...theme.typography.regular_l,
        },
      },
    },
    medium: {
      '.MuiInputBase-root.MuiOutlinedInput-root': {
        paddingTop: '0',
        paddingBottom: '0',
        'input.MuiAutocomplete-input': {
          ...theme.typography.regular_m,
          paddingTop: '0.4rem',
          paddingBottom: '0.4rem',
        },
      },
    },
    small: {
      '.MuiInputBase-root.MuiOutlinedInput-root': {
        paddingTop: '0.05rem',
        paddingBottom: '0.05rem',
        'input.MuiAutocomplete-input': {
          ...theme.typography.regular_s,
        },
      },
    },
  }[size];

  return {
    ...styles,
    '.MuiInputBase-root': {
      background: theme.palette.gray_light.main,
      fieldset: {
        borderRadius: '0.24rem',
        border: `0.0625rem solid ${
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

      textarea: {
        padding: '0.4rem 0',
      },
    },
    '.MuiSvgIcon-root, .MuiIconButton-root': {
      width: '1.5em',
      height: '1.5em',
      fontSize: 'unset',
    },
    '&.Mui-disabled, &.Mui-disabled input, &.Mui-disabled .MuiInputAdornment-root': {
      cursor: 'not-allowed',
    },
    '.MuiFormHelperText-root': {
      marginRight: 0,
      marginLeft: 0,
    },

    '.MuiAutocomplete-clearIndicator svg': {
      width: '1em',
      height: '1em',
      fontSize: 'unset',
    },
  };
});

export const ESPTextField = React.forwardRef(({ InputProps, ...props }: ESPTextFieldProps, ref) => {
  let { endAdornment } = InputProps || {};

  if (props.ownerState?.error) {
    endAdornment = (
      <>
        <ESPTooltip
          title={props.ownerState.errorMessage}
          placement="bottom-end"
          sx={{ left: '0.25rem', position: 'relative' }}
        >
          <ErrorOutlineIcon color="error" />
        </ESPTooltip>
        {endAdornment}
      </>
    );
  }

  return (
    <TextFieldComponent
      {...props}
      error={props.error || props.ownerState?.error}
      InputProps={{
        ...InputProps,
        endAdornment,
      }}
    />
  );
});
