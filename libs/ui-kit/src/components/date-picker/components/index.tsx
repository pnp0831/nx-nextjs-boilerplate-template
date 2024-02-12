import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';
import { DateField } from '@mui/x-date-pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import loOmit from 'lodash/omit';
import React from 'react';

import { ESPTextField } from '../../text-field/text-field';
import { ESPTooltip } from '../../tooltip/tooltip';
import { ESPDesktopDatePickerProps, ICustomFieldComponentProps } from '../type';

export const DatePickerComponent = styled(DesktopDatePicker)<ESPDesktopDatePickerProps>(
  ({ theme, size = 'medium' }) => {
    const styles = {
      large: {
        height: '2.5rem',
        ...theme.typography.regular_l,
        input: {
          padding: '0.5rem 0.75rem',
        },
        '.MuiInputAdornment-positionEnd': {
          paddingRight: '0.5rem',
        },
      },
      medium: {
        height: '2rem',
        ...theme.typography.regular_m,
        input: {
          padding: '0.5rem 0.625rem',
        },
        '.MuiInputAdornment-positionEnd': {
          paddingRight: '0.4rem',
        },
      },
      small: {
        height: '1.5rem',
        ...theme.typography.regular_s,
        input: {
          padding: '0.25rem 0.5rem',
        },
        '.MuiInputAdornment-positionEnd': {
          paddingRight: '0.3rem',
        },
      },
    }[size];

    return {
      width: '20rem',
      '.MuiInputBase-root': {
        ...styles,
        backgroundColor: theme.palette.gray_light.main,
        fieldset: {
          borderColor: theme.palette.gray_medium.main,
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },

        '&.Mui-disabled': {
          fieldset: {
            borderColor: theme.palette.gray_medium.main,
          },
        },
      },
      '.MuiSvgIcon-root, .MuiIconButton-root': {
        width: '1.5em',
        height: '1.5em',
        fontSize: 'unset',
      },
    };
  }
);

export const DateFieldComponent = styled(DateField)(({ theme }) => {
  return {
    '.MuiInputBase-root': {
      background: theme.palette.gray_light.main,
      '&.Mui-error fieldset': {
        borderWidth: '0.125rem',
      },
      '&:hover.Mui-error fieldset': {
        borderColor: theme.palette.error.main,
      },
      '&.Mui-disabled fieldset, &:hover&.Mui-disabled fieldset': {
        borderColor: theme.palette.gray_medium.main,
      },
      textarea: {
        padding: '0.4rem 0',
      },
    },
  };
});

// TODO: defined interface
export function CustomTextFieldComponent(props: ICustomFieldComponentProps) {
  const {
    format,
    value,
    selectedSections,
    onSelectedSectionsChange,
    formatDensity,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    slotProps,
    shouldDisableDate,
    InputProps,
    errorMessage,
    ...inputProps
  } = props;

  let endAdornment = (
    <>
      {value && inputProps.ownerState.clearable && (
        <CloseIcon
          onClick={(e) => {
            e.stopPropagation();

            props.onChange(null, { validationError: null });
          }}
          sx={{ cursor: 'pointer', position: 'relative', left: '0.25rem' }}
        />
      )}

      {InputProps.endAdornment}
    </>
  );

  if (inputProps.ownerState?.error && inputProps.ownerState.allowUserInput) {
    endAdornment = (
      <>
        <ESPTooltip
          title={inputProps.ownerState.errorMessage as string}
          placement="bottom-end"
          sx={{ left: '0.25rem', position: 'relative' }}
        >
          <ErrorOutlineIcon color="error" />
        </ESPTooltip>
        {endAdornment}
      </>
    );
  }

  if (!inputProps.ownerState.allowUserInput) {
    let tmpValue = '';

    const placeholder = format;

    if (value) {
      try {
        tmpValue = value.format(format as string);
      } catch {
        //
      }
    }

    return (
      <ESPTextField
        {...loOmit(inputProps, ['onChange'])}
        InputProps={{
          ...InputProps,
          endAdornment,
        }}
        value={tmpValue}
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

  return (
    <DateFieldComponent
      {...inputProps}
      value={inputProps.ownerState.value}
      InputProps={{
        ...InputProps,
        endAdornment,
      }}
      format={format}
    />
  );
}

export const CustomTextField = React.forwardRef((props: ICustomFieldComponentProps, _ref) => (
  <CustomTextFieldComponent {...props} />
));
