'use client';

import { useTheme } from '@mui/material/styles';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';
import { Dayjs } from 'dayjs';
import { forwardRef, useEffect, useState } from 'react';

import { ESPDatepicker } from '../date-picker/date-picker';
import { ActionBar, CustomTextField } from './components';
import { popoverStyle } from './helpers';
import { DateTimePickerProps } from './type';

export const ESPDateTimePicker = forwardRef(
  (
    {
      placeholder = 'HH:MM - HH:MM, DD/MMM/YYYY',
      format = 'DD/MM/YYYY',
      ...props
    }: DateTimePickerProps,
    ref
  ) => {
    const [open, setOpen] = useState<boolean>(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState<Dayjs | null>();
    const theme = useTheme();

    useEffect(() => {
      if (startTime && endTime && date && typeof props.onChange === 'function') {
        props.onChange(`${startTime} - ${endTime}, ${date.format(format)}`);
      }
    }, [startTime, endTime, date, props, format]);

    return (
      <ESPDatepicker
        value={date}
        open={open}
        onOpen={() => {
          setOpen(!open);
        }}
        onClose={() => {
          setOpen(false);
        }}
        closeOnSelect={false}
        {...props}
        slots={{
          // @ts-expect-error: IGNORE
          actionBar: ActionBar,
          // @ts-expect-error: IGNORE
          field: CustomTextField,
        }}
        onChange={(date: Dayjs | null) => {
          setDate(date);
        }}
        slotProps={{
          field: {
            // @ts-expect-error: IGNORE
            endTime,
            startTime,
            date,
            format,
          },
          actionBar: {
            // @ts-expect-error: IGNORE
            setStartTime,
            setEndTime,
            startTime,
            endTime,
            format,
          },
          layout: {
            sx: {
              [`.${pickersLayoutClasses.contentWrapper}`]: {
                gridRow: 2,
                gridColumn: 1,
              },
            },
          },
        }}
        popoverStyle={popoverStyle(theme)}
      />
    );
  }
);

export default ESPDateTimePicker;
