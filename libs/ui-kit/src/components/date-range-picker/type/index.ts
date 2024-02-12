import { FilledInputProps, InputProps, OutlinedInputProps } from '@mui/material';
import { Dayjs } from 'dayjs';

import { ESPDesktopDatePickerProps } from '../../date-picker/type/index';

export interface ESPDaterangePickerProps
  extends Omit<ESPDesktopDatePickerProps, 'value' | 'onChange'> {
  value?: Array<Dayjs | null>;
  onChange?: (date: (Dayjs | null)[]) => void;
  format?: string;
  placeholder?: string;
}

export interface EmptyProps {
  [key: string]: unknown;
}

export interface ICustomFieldComponentProps extends EmptyProps {
  ownerState: {
    onOpen: () => void;
    [key: string]: unknown;
  };
  format: string;
  placeholder: string;
  slotProps: {
    dateRange: Dayjs[];
    textField: { placeholder: string; onClear: () => void };
  };
  InputProps: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps>;
  errorMessage?: string;
}
