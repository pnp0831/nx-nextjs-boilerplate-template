'use client';

import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react';

import { ESPTooltip } from '../tooltip';
import { OutlinedInputComponent } from './components';
import { ESPInputProps } from './type';

export const ESPInput = React.forwardRef(
  ({ size = 'large', search, errorMessage, ...props }: ESPInputProps, ref) => {
    const extendProps: ESPInputProps = {};

    if (search) {
      extendProps['placeholder'] = 'Search';
      extendProps['startAdornment'] = (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      );
    }

    if (props.success) {
      extendProps['color'] = 'success';
      extendProps['endAdornment'] = (
        <InputAdornment position="end">
          <CheckIcon color="success" />
          {props.endAdornment}
        </InputAdornment>
      );
    }

    if (props.error) {
      extendProps['endAdornment'] = (
        <InputAdornment position="end">
          <ESPTooltip
            title={errorMessage}
            placement="bottom-end"
            sx={{ left: props.endAdornment ? '0.25rem' : 0, position: 'relative' }}
          >
            <ErrorOutlineIcon color="error" />
          </ESPTooltip>
          {props.endAdornment}
        </InputAdornment>
      );
    }

    return <OutlinedInputComponent size={size} {...props} {...extendProps} />;
  }
);

ESPInput.displayName = 'ESPInput';

export const ESPInputPassword = React.forwardRef((props: ESPInputProps, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <ESPInput
      {...props}
      type={showPassword ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position="end">
          <IconButton disabled={props.disabled} onClick={handleClickShowPassword}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
});

ESPInputPassword.displayName = 'ESPInputPassword';

export default ESPInput;
