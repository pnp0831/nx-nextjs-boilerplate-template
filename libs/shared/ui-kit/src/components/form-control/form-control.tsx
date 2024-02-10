'use client';
import { FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import { useTheme } from '@mui/material/styles';
import React, { forwardRef, memo, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import { FormControlComponent } from './components';
import { Chilren, ESPFormControlError, ESPFormControlProps } from './type';

const ESPFormControlComponent = memo(
  <T extends FieldValues>({
    children,
    label,
    helperText,
    controller,
    required,
    disabled,
    rhfParams,
    onChange,
    ...props
  }: ESPFormControlProps<T>) => {
    const theme = useTheme();

    let error = props.error;
    let tmpHelperText = helperText;

    if (rhfParams) {
      const { field: rhfField, formState } = rhfParams;

      error = formState.errors?.[rhfField?.name] as ESPFormControlError;

      tmpHelperText = error?.message;
    }

    const element = useMemo(() => {
      return React.cloneElement((controller || children) as Chilren, {
        ...(rhfParams?.field || {}),
        error: !!error,
        errorMessage: tmpHelperText,
        onChange: onChange || rhfParams?.field?.onChange,
      });
    }, [children, controller, error, tmpHelperText, onChange, rhfParams]);

    return (
      <FormControlComponent
        {...props}
        error={!!error}
        disabled={disabled}
        sx={{
          ...(error
            ? {
                '&.MuiFormControl-root fieldset': {
                  borderColor: theme.palette.error.main,
                  borderWidth: '0.125rem',
                },
              }
            : {}),
          ...props.sx,
        }}
      >
        {label && (
          <FormLabel style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>
            {label}
            {required && (
              <Box component={'span'} sx={{ color: '#C84040', marginLeft: '0.125rem' }}>
                *
              </Box>
            )}
          </FormLabel>
        )}
        {element}
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControlComponent>
    );
  }
);

type T = FieldValues;

export const ESPFormControl = forwardRef<unknown, T>((props: ESPFormControlProps<T>, _ref) => {
  return <ESPFormControlComponent {...props} />;
});

ESPFormControl.displayName = 'ESPFormControl';

export default ESPFormControl;
