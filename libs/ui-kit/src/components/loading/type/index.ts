import { SxProps, Theme } from '@mui/material/styles';
import { RefObject } from 'react';

import { Size } from '../../../theme';

export interface ESPLoadingProps {
  loading?: boolean;
  size?: Size;
  container?: RefObject<HTMLElement>;
  hasContainer?: boolean;
  sx?: SxProps<Theme> | undefined;
}
