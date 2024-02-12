'use client';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Checkbox from '@mui/material/Checkbox';
import React from 'react';

import { CheckBoxOutlineBlankIcon, RadioButtonUncheckedIcon } from './components';
import { ESPCheckboxProps } from './type';

export const ESPCheckbox = React.forwardRef(
  ({ round, size = 'medium', error, errorMessage, ...props }: ESPCheckboxProps, ref) => {
    const checkedIcon = round ? (
      <CheckCircleIcon sx={error ? { color: '#C84040' } : {}} />
    ) : (
      <CheckBoxIcon sx={error ? { color: '#C84040' } : {}} />
    );

    const uncheckedIcon = round ? (
      <RadioButtonUncheckedIcon sx={error ? { color: '#C84040' } : {}} />
    ) : (
      <CheckBoxOutlineBlankIcon sx={error ? { color: '#C84040' } : {}} />
    );

    return (
      <Checkbox
        disableRipple
        {...props}
        size={size}
        checkedIcon={checkedIcon}
        icon={uncheckedIcon}
      />
    );
  }
);

ESPCheckbox.displayName = 'ESPCheckbox';

export default ESPCheckbox;
