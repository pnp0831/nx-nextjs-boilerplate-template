import { PopperPlacementType } from '@mui/material';
import { DateValidationError } from '@mui/x-date-pickers';
import { DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';

import { Size } from '../../../theme';

export interface ESPDesktopDatePickerProps extends DesktopDatePickerProps<Dayjs> {
  size?: Size;
  daterange?: boolean;
  disabledWeekend?: boolean;
  value?: null | Dayjs;
  popoverStyle?: { [key: string]: unknown };
  popoverPosition?: PopperPlacementType;
  clearable?: boolean;
  allowUserInput?: boolean;
}

export interface EmptyProps {
  [key: string]: unknown;
}

export interface ICustomFieldComponentProps extends EmptyProps {
  ownerState: {
    onOpen: () => void;
    value: Dayjs;
    [key: string]: unknown;
    clearable?: boolean;
    allowUserInput?: boolean;
  };
  format: string;
  value: Dayjs;
  InputProps: {
    endAdornment: ReactNode | null | string;
  };
  onChange: (
    value: Dayjs | null | unknown,
    context: { validationError: DateValidationError }
  ) => void;
  errorMessage?: string;
}
