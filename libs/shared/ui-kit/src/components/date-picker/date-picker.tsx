'use client';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { forwardRef, useRef, useState } from 'react';

import { CustomTextField, DatePickerComponent } from './components';
import { getSlotProps } from './helpers';
import { ESPDesktopDatePickerProps } from './type';

export const ESPDatepicker = forwardRef(
  (
    {
      size = 'medium',
      format = 'DD/MM/YYYY',
      slots,
      slotProps,
      disabledWeekend,
      popoverStyle,
      popoverPosition,
      ...props
    }: ESPDesktopDatePickerProps,
    ref
  ) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const datePickerRef = useRef(null);

    return (
      <DatePickerComponent
        ref={datePickerRef}
        size={size}
        format={format}
        open={open}
        onOpen={() => {
          setOpen(!open);
        }}
        onClose={() => {
          setOpen(false);
        }}
        {...props}
        // @ts-expect-error: IGNORE
        slotProps={getSlotProps(theme, slotProps, popoverStyle, popoverPosition)}
        shouldDisableDate={(date: Dayjs | unknown) => {
          if (!disabledWeekend) {
            return false;
          }

          // 0 is sunday, 6 is Saturday
          return [0, 6].includes(dayjs(date as Dayjs).day());
        }}
        showDaysOutsideCurrentMonth
        // TODO: defined type slots
        slots={{
          openPickerIcon: DateRangeIcon,
          rightArrowIcon: ArrowForwardIosIcon,
          leftArrowIcon: ArrowBackIosIcon,
          // @ts-expect-error: IGNORE
          field: CustomTextField,
          ...slots,
        }}
      />
    );
  }
);

export default ESPDatepicker;
