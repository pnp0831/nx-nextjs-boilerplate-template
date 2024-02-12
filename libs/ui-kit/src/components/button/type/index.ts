import { ButtonProps } from '@mui/material/Button';

export type ESPButtonColors = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

export interface ESPButtonProps extends Omit<ButtonProps, 'color'> {
  color?: ESPButtonColors;
  loading?: boolean;
}
