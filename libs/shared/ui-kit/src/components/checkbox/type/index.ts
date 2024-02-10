import { CheckboxProps } from '@mui/material/Checkbox';

export interface ESPCheckboxProps extends CheckboxProps {
  round?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export interface IconCheckBoxProps {
  round?: boolean;
  fontSize?: string;
}
