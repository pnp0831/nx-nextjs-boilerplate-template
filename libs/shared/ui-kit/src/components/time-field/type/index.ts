import { TimeFieldProps } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

export interface ESPTimeFieldProps extends Omit<TimeFieldProps<any>, 'size'> {
  size?: 'small' | 'medium' | 'large';
  onChange?: () => void;
  value?: Dayjs | null | string;
  label?: string;
  format?: string;
  defaultValue?: Dayjs | null | string;
  error?: boolean;
  errorMessage?: string;
  endAdornment?: React.ReactNode;
}
