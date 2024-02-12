import { TextFieldProps } from '@mui/material/TextField';

import { Size } from '../../../theme';

export interface ESPTextFieldProps
  extends Omit<TextFieldProps, 'size' | 'placeholder' | 'success'> {
  success?: boolean;
  size?: Size;
  placeholder?: string;
  ownerState?: {
    error?: boolean;
    errorMessage?: string;
    [key: string]: unknown;
  };
}
