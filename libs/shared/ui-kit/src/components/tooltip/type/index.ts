import { TooltipProps } from '@mui/material/Tooltip';
import { CSSProperties, ReactNode } from 'react';

export interface ESPTooltipProps extends TooltipProps {
  contentStyle?: CSSProperties;
  textAlign?: 'left' | 'center' | 'right';
  textTransform?: 'capitalize' | 'lowercase' | 'uppercase' | 'none';
}

export interface WrapperChildProps {
  children: ReactNode;
}
