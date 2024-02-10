import { Dayjs } from 'dayjs';

import { ESPDesktopDatePickerProps } from '../../date-picker/type/index';

export interface DateTimePickerProps extends Omit<ESPDesktopDatePickerProps, 'onChange'> {
  placeholder?: string;
  format?: string;
  onChange?: (value: string) => void;
}

export interface Option {
  value: string | number;
  [key: string]: string | boolean | number;
}

export interface ActionBarProps {
  setStartTime: (value: unknown) => void;
  setEndTime: (value: unknown) => void;
  onChange?: (event: unknown) => void;
  startTime: string;
  endTime: string;
  format: string;
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
  date: Dayjs;
}
