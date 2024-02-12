'use client';

import { BadgeProps } from '@mui/material/Badge';

import { BadgeComponent } from './components';

export function ESPBadge({ children, ...props }: BadgeProps) {
  return (
    <BadgeComponent {...props} color="primary" max={9}>
      {children}
    </BadgeComponent>
  );
}

export default ESPBadge;
