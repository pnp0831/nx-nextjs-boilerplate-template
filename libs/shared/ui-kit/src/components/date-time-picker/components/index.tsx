import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import loOmit from 'lodash/omit';
import React from 'react';

import { ESPTextField } from '../../text-field/text-field';
import ESPTimepicker from '../../time-picker';
import { ESPTypography } from '../../typography/typography';
import { ActionBarProps, ICustomFieldComponentProps, Option } from '../type';

// TODO: defined interface
function CustomTextFieldComponent(props: ICustomFieldComponentProps) {
  const {
    selectedSections,
    onSelectedSectionsChange,
    formatDensity,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    slotProps,
    shouldDisableDate,
    format = 'DD/MM/YYYY',
    startTime,
    endTime,
    date,
    ...inputProps
  } = props;

  let value = '';

  const placeholder = `${startTime || 'HH:mm'} - ${endTime || 'HH:mm'}, ${
    date ? dayjs(date).format(format as string) : format
  }`;

  if (startTime && endTime && date) {
    value = `${startTime} - ${endTime}, ${dayjs(date).format(format as string)}`;
  }

  return (
    <ESPTextField
      {...loOmit(inputProps, ['onChange'])}
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

// TODO: defined interface
export function ActionBar(props: ActionBarProps) {
  const { setStartTime, setEndTime, startTime, endTime } = props;

  return (
    // Propagate the className such that CSS selectors can be applied
    <Box className="time-picker">
      <ESPTimepicker
        data-testid="start-time"
        className="time-picker-input"
        sx={{ width: '7rem' }}
        placeholder="Start"
        size="medium"
        popupIcon={<AccessTimeIcon fontSize="small" />}
        onChange={(option) => {
          if (!option) {
            return setStartTime('');
          }

          const { value } = option as unknown as Option;
          setStartTime(value);
        }}
        value={startTime}
      />
      <ESPTypography variant="regular_l">to</ESPTypography>

      <ESPTimepicker
        data-testid="end-time"
        className="time-picker-input"
        sx={{ width: '7rem' }}
        placeholder="End"
        size="medium"
        popupIcon={<AccessTimeIcon fontSize="small" />}
        onChange={(option) => {
          if (option === null) {
            return setEndTime('');
          }

          const { value } = option as unknown as Option;
          setEndTime(value);
        }}
        value={endTime}
      />
    </Box>
  );
}

export const CustomTextField = React.forwardRef((props: ICustomFieldComponentProps, _ref) => (
  <CustomTextFieldComponent {...props} />
));
