import { ReactNode } from 'react';

import { ESPTooltipProps } from '../../tooltip/type/index';

export interface ESPPopoverProps extends Omit<ESPTooltipProps, 'title'> {
  popoverContent: string | ReactNode;
  onOpenChange?: (open: boolean) => void;
}
