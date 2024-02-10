'use client';

import { useTheme } from '@mui/material/styles';
import { Dayjs } from 'dayjs';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { ESPDatepicker } from '../date-picker/date-picker';
import { CustomDay, CustomTextField } from './components';
import { popoverStyle } from './helpers';
import { ESPDaterangePickerProps } from './type';

export const ESPDaterangepicker = forwardRef(
  (
    {
      value: initValue,
      onChange,
      format = 'DD/MM/YYYY',
      placeholder,
      ...props
    }: ESPDaterangePickerProps,
    _ref
  ) => {
    const [values, setValues] = useState(initValue || [null, null]);
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const refClickStartOrEnd = useRef('start');

    useEffect(() => {
      if (!open) {
        refClickStartOrEnd.current = 'start';
      }
    }, [open]);

    const handleOnChange = (date: Dayjs | null) => {
      if (refClickStartOrEnd.current === 'start') {
        setValues([date, null]);
        return (refClickStartOrEnd.current = 'end');
      }

      let startDate = values[0];
      let endDate = date;

      if (endDate && startDate && endDate.isBefore(startDate)) {
        endDate = startDate;
        startDate = date;
      }

      setValues([startDate, endDate]);

      setOpen(false);
    };

    useEffect(() => {
      const [startDate, endDate] = values;

      if (typeof onChange === 'function' && startDate && endDate) {
        onChange([startDate, endDate]);
      }
    }, [onChange, values]);

    const onClear = () => {
      setValues([null, null]);
      if (typeof onChange === 'function') {
        onChange(null as unknown as Dayjs[]);
      }
    };

    return (
      <ESPDatepicker
        value={values?.[0]}
        open={open}
        onOpen={() => {
          setOpen(!open);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(date) => {
          handleOnChange(date);
        }}
        closeOnSelect={false}
        // @ts-expect-error: IGNORE
        slots={{ field: CustomTextField, day: CustomDay }}
        slotProps={{
          dateRange: values,
          day: {
            // Add custom slotsProps
            // @ts-expect-error: IGNORE
            dateRange: values,
            // @ts-expect-error: IGNORE
            format,
            onChange: handleOnChange,
          },
          textField: {
            placeholder: placeholder || `${format} - ${format}`,
            // @ts-expect-error: IGNORE
            onClear,
          },
        }}
        format={format}
        {...props}
        popoverStyle={popoverStyle(theme)}
      />
    );
  }
);

ESPDaterangepicker.displayName = 'ESPDaterangepicker';

export default ESPDaterangepicker;
