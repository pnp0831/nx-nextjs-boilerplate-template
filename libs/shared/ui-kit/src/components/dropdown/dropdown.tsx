'use client';

import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import React, { ReactElement, ReactNode, useState } from 'react';

import { hexToRgb } from '../../helpers/index';
import { ESPTooltip } from '../tooltip';
import { SelectComponent } from './components';
import { Chilren, ESPDropdownProps } from './type';

export function ESPDropdown({
  children,
  placeholder,
  value: initValue = undefined,
  displayEmpty = true,
  ...props
}: ESPDropdownProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | number | null | undefined>(initValue || '');

  const handleChange = (e: SelectChangeEvent<unknown>, _child: ReactNode) => {
    const value = e.target.value as number;
    setValue(value);

    if (typeof props.onChange === 'function') {
      props.onChange(e, _child);
    }
  };

  const placeHolder = placeholder || 'None';

  const IconComponent = () => (
    <>
      {props.error && props.errorMessage && (
        <ESPTooltip title={props.errorMessage} placement="bottom-end" sx={{ marginRight: '2rem' }}>
          <ErrorOutlineIcon color="error" />
        </ESPTooltip>
      )}
      <IconButton
        onClick={() => {
          setOpen((open) => !open);
        }}
        sx={{
          position: 'absolute',
          right: '0.4375rem',
          width: '1.5em',
          height: '1.5em',
          fontSize: 'unset',
        }}
      >
        <KeyboardArrowDownIcon
          sx={{
            transform: `rotate(${open ? '180' : 0}deg)`,
            cursor: 'pointer',
          }}
        />
      </IconButton>
    </>
  );

  return (
    <SelectComponent
      displayEmpty
      {...props}
      value={value}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleChange}
      IconComponent={IconComponent}
      MenuProps={{
        disablePortal: true,
        PaperProps: {
          sx: {
            width: 'max-content',
            minWidth: '100%',
            mt: 1.5,
            bgcolor: theme.palette.common.white,
            position: 'relative',
            overflow: 'visible',

            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: '0.875rem',
              width: '0.5rem',
              height: '0.5rem',
              bgcolor: theme.palette.common.white,
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },

            ul: {
              color: theme.palette.common.black,
              padding: '0.5rem',
              position: 'relative',
              maxHeight: '50vh',
              overflow: 'auto',

              'li.MuiButtonBase-root': {
                borderRadius: '0.25rem',
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:hover, &[aria-selected="true"]:hover': {
                  backgroundColor: theme.palette.gray_light.main,
                  color: theme.palette.primary.main,
                },
                '&[aria-selected="true"], &.Mui-selected': {
                  backgroundColor: 'unset',
                  color: theme.palette.primary.main,
                },
                '&[aria-disabled="true"], &[aria-disabled="true"]:hover, &.Mui-disabled': {
                  opacity: 1,
                  color: hexToRgb(theme.palette.black_muted.main, 0.4),
                  cursor: 'not-allowed',
                },
              },
            },
          },
        },
      }}
      inputProps={{ 'aria-label': String(value || placeHolder) }}
      sx={{
        '> div': {
          [`&[aria-label="${placeHolder}"]`]: {
            color: theme.palette.black_muted.main,
          },
        },
        ...props.sx,
      }}
    >
      {displayEmpty && (
        <MenuItem value={''} disabled>
          {placeHolder}
        </MenuItem>
      )}
      {React.Children.map(children as Chilren, (child: ReactElement, _i) => {
        const active = child.props.value === value;
        const { disabled } = child.props;

        const el = React.cloneElement(
          child,
          {},
          <>
            {child.props.children}
            {active && !disabled && <CheckIcon />}
          </>
        );

        return el;
      })}
    </SelectComponent>
  );
}

export default ESPDropdown;
