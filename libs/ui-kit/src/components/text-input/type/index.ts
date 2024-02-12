import { OutlinedInputProps } from '@mui/material/OutlinedInput';

import { Size } from '../../../theme';

export interface ESPInputProps extends Omit<OutlinedInputProps, 'size'> {
  success?: boolean;
  search?: boolean;
  size?: Size;
  errorMessage?: string;
}
