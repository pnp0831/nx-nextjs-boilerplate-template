'use client';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { InputAdornment } from '@mui/material';
import loOmit from 'lodash/omit';
import { forwardRef } from 'react';

import { ESPTooltip } from '../tooltip';
import { TimeFieldComponent } from './components';
import { ESPTimeFieldProps } from './type';

export const ESPTimeField = forwardRef(
  (
    {
      size = 'medium',
      onChange,
      label,
      value,
      format,
      defaultValue,
      errorMessage,
      ...props
    }: ESPTimeFieldProps,
    _ref
  ) => {
    return (
      <TimeFieldComponent
        size={size}
        label={label}
        format={format}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        slotProps={{
          textField: {
            InputProps: {
              endAdornment: props.error ? (
                <InputAdornment position="end">
                  <ESPTooltip title={errorMessage} placement="bottom-end">
                    <ErrorOutlineIcon color="error" />
                  </ESPTooltip>
                </InputAdornment>
              ) : (
                props.endAdornment ?? null
              ),
            },
          },
        }}
        {...loOmit(props, ['endAdornment'])}
      />
    );
  }
);

export default ESPTimeField;
