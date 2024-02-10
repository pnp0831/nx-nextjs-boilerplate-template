'use client';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import React, { useEffect, useState } from 'react';

import { ESPTooltip } from '../tooltip/tooltip';
import { ESPPopoverProps } from './type';

export function ESPPopover({
  children,
  popoverContent,
  placement,
  onOpenChange,
  ...props
}: ESPPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (typeof onOpenChange === 'function') {
      onOpenChange(open);
    }
  }, [open, onOpenChange]);

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <ESPTooltip
          placement={placement || 'bottom-end'}
          PopperProps={{
            disablePortal: true,
          }}
          {...props}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={popoverContent}
        >
          {React.Children.map(children, (child: any, _) => {
            const { props } = child;
            const el = React.cloneElement(child, {
              onClick: (_event: React.MouseEvent<HTMLElement>) => {
                if (typeof props.onClick === 'function') {
                  props.onClick();
                }

                setOpen(true);
              },
            });

            return el;
          })}
        </ESPTooltip>
      </div>
    </ClickAwayListener>
  );
}

export default ESPPopover;
