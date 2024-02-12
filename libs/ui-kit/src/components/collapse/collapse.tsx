'use client';

import Collapse from '@mui/material/Collapse';

import { ESPCollapseProps } from './type';

export function ESPCollapse({ children, in: open, ...props }: ESPCollapseProps) {
  return (
    <Collapse in={open} timeout="auto" unmountOnExit {...props}>
      {children}
    </Collapse>
  );
}

export default ESPCollapse;
