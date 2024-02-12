import { SelectProps } from '@mui/material/Select';

import { Size } from '../../../theme';

export interface ESPDropdownProps extends Omit<SelectProps, 'size' | 'value'> {
  options?: {
    name: React.ReactNode;
    value: string | number;
  }[];
  size?: Size;
  link?: boolean;
  success?: boolean;
  error?: boolean;
  placeholder?: string;
  value?: string | number | null | undefined;
  errorMessage?: string;
}

export type Chilren = React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
