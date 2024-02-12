import { FormControlProps } from '@mui/material/FormControl';
import { ReactNode } from 'react';
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormStateReturn,
} from 'react-hook-form';

export interface ESPFormControlRhfParams<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
}

export interface ESPFormControlError {
  message: string;
}

export interface ESPFormControlProps<T extends FieldValues>
  extends Omit<FormControlProps, 'error' | 'onChange'> {
  helperText?: string | React.ReactNode;
  label?: string | React.ReactNode;
  source?: string;
  controller?: React.ReactNode;

  rhfParams?: ESPFormControlRhfParams<T>;
  error?: boolean | ESPFormControlError;
  onChange?: (...params: unknown[]) => void;
  children?: string | ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Chilren = React.ReactElement<any, string | React.JSXElementConstructor<any>>;
