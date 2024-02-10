'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { forwardRef } from 'react';

import { ESPTooltipProps, WrapperChildProps } from './type';

const WrapperChild = forwardRef<HTMLDivElement, WrapperChildProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box
        {...props}
        ref={ref}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {children}
      </Box>
    );
  }
);

export function ESPTooltip({
  children,
  contentStyle,
  textAlign,
  textTransform = 'none',
  ...props
}: ESPTooltipProps) {
  const theme = useTheme();
  return (
    <Tooltip
      {...props}
      arrow
      slotProps={{
        ...props.slotProps,
        tooltip: {
          sx: {
            textTransform: textTransform,
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
            filter: 'drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.10))',
            borderRadius: '0.25rem',
            padding: '0.5rem 0.75rem',
            ...theme.typography.regular_m,
            minWidth: '5rem',
            textAlign: textAlign || 'center',
            ...contentStyle,
          },
          ...props.slotProps?.tooltip,
        },
        arrow: {
          sx: {
            color: theme.palette.common.white,
          },
          ...props.slotProps?.arrow,
        },
      }}
    >
      <WrapperChild>{children}</WrapperChild>
    </Tooltip>
  );
}
