import CloseIcon from '@mui/icons-material/Close';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import clsx from 'clsx';
import { Dayjs } from 'dayjs';
import loOmit from 'lodash/omit';
import React from 'react';

import { getDatesBetweenTwoDays } from '../../../helpers';
import { ESPTextField } from '../../text-field/text-field';
import { ICustomFieldComponentProps } from '../type';

const onMouseLeave = (date: string) => {
  const elms = document.getElementsByClassName('MuiDayCalendar-highlightDay__dashed');

  for (let index = 0; index < elms.length; index++) {
    const element = elms[index];

    element.classList.remove('MuiDayCalendar-highlightDay-firstDay__dashed');
    element.classList.remove('MuiDayCalendar-highlightDay-lastDay__dashed');
    element.classList.remove('MuiDayCalendar-highlightDay-betweenDay__dashed');
  }
};

const onMouseOver = (start: Dayjs, end: Dayjs, format: string, disabled?: boolean) => {
  if (start) {
    const startDate = start.isAfter(end) ? end : start;
    const endDate = start.isAfter(end) ? start : end;
    const daysBetween = getDatesBetweenTwoDays(startDate, endDate, format);

    Object.keys(daysBetween).forEach((day, index) => {
      const firstDay = index === 0;

      const lastDay = index === Object.keys(daysBetween).length - 1;

      const isBetweenDay = !firstDay && !lastDay;

      const ele = document.getElementById(`date-${day}`);

      ele?.classList.add('MuiDayCalendar-highlightDay__dashed');

      if (!disabled) {
        switch (true) {
          case firstDay:
            ele?.classList.add('MuiDayCalendar-highlightDay-firstDay__dashed');
            break;
          case lastDay:
            ele?.classList.add('MuiDayCalendar-highlightDay-lastDay__dashed');
            break;
          case isBetweenDay:
            ele?.classList.add('MuiDayCalendar-highlightDay-betweenDay__dashed');
            break;

          default:
            break;
        }
      }
    });
  }
};

export function CustomDay(
  props: PickersDayProps<Dayjs> & {
    selectedDay?: Dayjs | null | undefined;
    format: string;
    dateRange: Array<Dayjs | null>;
    onChange: (date: Dayjs) => void;
  }
) {
  const {
    day: currentDate,
    selectedDay,
    dateRange = [],
    format,
    disabled,
    onChange,
    ...other
  } = props;

  const onDaySelect = (date: Dayjs) => {
    onChange(date);
  };

  const [startDate, endDate] = dateRange || [null, null];

  if (startDate && !endDate) {
    return (
      <div
        id={`date-${currentDate.format(format)}`}
        onMouseOver={() => {
          onMouseOver(startDate, currentDate, format, disabled);
        }}
        onMouseLeave={() => {
          onMouseLeave(currentDate.format(format));
        }}
      >
        <PickersDay {...other} disabled={disabled} onDaySelect={onDaySelect} day={currentDate} />
      </div>
    );
  }

  if (startDate && endDate) {
    const dayIsBetween = currentDate.isBetween(
      startDate.startOf('d'),
      endDate.startOf('d'),
      'day',
      '()'
    );
    const isFirstDay = startDate.startOf('d').isSame(currentDate);
    const isLastDay = endDate.startOf('d').isSame(currentDate);

    return (
      <div
        className={clsx({
          'MuiDayCalendar-highlightDay': dayIsBetween || isFirstDay || isLastDay,
          'MuiDayCalendar-highlightDay-firstDay': isFirstDay,
          'MuiDayCalendar-highlightDay-lastDay': isLastDay,
          'MuiDayCalendar-highlightDay-betweenDay': dayIsBetween,
        })}
      >
        <PickersDay {...other} disabled={disabled} onDaySelect={onDaySelect} day={currentDate} />
      </div>
    );
  }

  return <PickersDay {...other} disabled={disabled} onDaySelect={onDaySelect} day={currentDate} />;
}

// TODO: define type
function CustomTextFieldComponent(props: ICustomFieldComponentProps) {
  const {
    slotProps: {
      dateRange,
      textField: { placeholder, onClear },
    },
    selectedSections,
    onSelectedSectionsChange,
    formatDensity,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    slotProps,
    shouldDisableDate,
    format,
    InputProps,
    errorMessage,
    ...inputProps
  } = props;

  const [startDate, endDate]: Dayjs[] = dateRange || [null, null];

  const formatYear = 'YYYY';

  let value = '';

  if (startDate) {
    value = `${startDate.format(format)} - ${format}, ${startDate.format(formatYear)}`;
  }

  if (startDate && endDate) {
    value = `${startDate.format(format)} - ${endDate.format(format)}, ${endDate.format(
      formatYear
    )}`;
    if (!startDate.isSame(endDate, 'year')) {
      value = `${startDate.format(`${format}/${formatYear}`)} - ${endDate.format(
        `${format}/${formatYear}`
      )}`;
    }
  }

  const isFullValue = startDate && endDate;

  return (
    <ESPTextField
      {...loOmit(inputProps, ['onChange'])}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <>
            {isFullValue && (
              <CloseIcon
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                sx={{ cursor: 'pointer', position: 'relative', left: '0.25rem' }}
              />
            )}
            {InputProps.endAdornment}
          </>
        ),
      }}
      value={value}
      placeholder={placeholder}
      onClick={() => {
        const { onOpen } = inputProps.ownerState;
        if (typeof onOpen === 'function') {
          onOpen();
        }
      }}
    />
  );
}

export const CustomTextField = React.forwardRef((props: ICustomFieldComponentProps, _ref) => (
  <CustomTextFieldComponent {...props} />
));
