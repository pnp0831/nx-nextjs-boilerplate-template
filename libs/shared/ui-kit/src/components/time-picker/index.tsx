import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React, { ReactNode, useMemo } from 'react';

import { Size } from '../../theme';
import { ESPAutocomplete } from '../autocomplete/autocomplete';
import { ESPAutocompleteProps } from '../autocomplete/type/index';

const times = [];
for (let i = 1; i <= 24; i++) {
  times.push(`${Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`);
}

export interface Option {
  label: string | ReactNode;
  value: string | number;
  disabled?: boolean;
}

interface TimepickerProps extends Omit<ESPAutocompleteProps, 'options' | 'onChange'> {
  size?: Size;
  amPmAriaLabel?: 'AM' | 'PM';
  disablePast?: boolean;
  disableFeature?: boolean;
  popupIcon?: ReactNode;
  options?: Option[];
  onChange?: (value: NonNullable<string | Option> | (string | Option)[] | null) => void;
}

const ESPTimepicker = ({
  size,
  amPmAriaLabel = 'AM',
  disableFeature,
  disablePast,
  onChange,
  ...props
}: TimepickerProps) => {
  const options: { label: string; value: string }[] = useMemo(() => {
    const times: {
      label: string;
      value: string;
      disabled?: boolean;
    }[] = [];

    for (let i = 0; i <= 23; i++) {
      const value = `${Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`;

      times.push({
        value,
        label: `${value} ${amPmAriaLabel}`,
        disabled: i % 2 === 0,
      });
    }

    return times;
  }, [amPmAriaLabel]);

  return (
    <ESPAutocomplete
      size={size}
      // disableClearable
      options={props.options || options}
      placeholder="HH:mm"
      popupIcon={<AccessTimeIcon fontSize="small" sx={{ fontSize: '1em' }} />}
      {...props}
      fullWidth
      onChange={onChange}
    />
  );
};

export default ESPTimepicker;
