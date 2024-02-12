'use client';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { ESPTooltip } from '../tooltip';
import { ESPInfoTooltipProps } from './type';

export function ESPInfoTooltip({ content }: ESPInfoTooltipProps) {
  return (
    <ESPTooltip className="esp-info-tooltip" title={content} placement="right">
      <ErrorOutlineIcon sx={{ color: '#CC883A' }}></ErrorOutlineIcon>
    </ESPTooltip>
  );
}

export default ESPInfoTooltip;
