import './index.scss';

import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useTheme } from '@mui/material/styles';
import { hexToRgb } from '@ui-kit/helpers';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { HEIGHT_OF_SLOT, heightOfSlots, SlotDuration } from './type';

interface CustomDayCellContentProps {
  slotDuration: SlotDuration;
  dragging: boolean;
}

const CustomDayCellContent: React.FC<CustomDayCellContentProps> = ({ slotDuration, dragging }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slotRenderHeight, setSlotRenderHeight] = useState<number>(HEIGHT_OF_SLOT['1h']);
  const [offsetTop, setOffsetTop] = useState<string | number>('-100%');
  const theme = useTheme();

  useEffect(() => {
    const slotRenderHeight = heightOfSlots[slotDuration];

    setSlotRenderHeight(slotRenderHeight);
  }, [slotDuration]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const isHoverOnFcHover =
        e.target instanceof HTMLElement && Array.from(e.target.classList).includes('fc-slot-hover');

      if (isHoverOnFcHover) {
        const { offsetY } = e;

        const hoveredItemIndex = Math.floor(offsetY / (slotRenderHeight * 16));

        const offset = `${slotRenderHeight * hoveredItemIndex}rem`;

        setOffsetTop(offset);
      }
    },
    [slotRenderHeight, setOffsetTop]
  );

  const handleMouseOut = useCallback((e: MouseEvent) => {
    if (!e.relatedTarget) {
      return setOffsetTop('-100%');
    }

    const arrCheck = [
      'fc-timegrid-slot',
      'fc-slot-hover',
      'fc-col-header-cell',
      'full-calendar',
      'fc-day-header-content',
      'eventBackground',
      'MuiTypography-root',
      'fc-timegrid-event-harness',
    ];
    const isHoverOnFcHover =
      e.relatedTarget instanceof HTMLElement &&
      (Array.from(e.relatedTarget?.classList || []).some((key: string) => arrCheck.includes(key)) ||
        e.relatedTarget?.tagName.toLowerCase() === 'td');

    if (isHoverOnFcHover) {
      setOffsetTop('-100%');
    }
  }, []);

  useEffect(() => {
    const { current: element } = containerRef;

    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      element?.removeEventListener('mousemove', handleMouseMove);
      element?.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseMove, handleMouseOut]);

  if (dragging) {
    return <div />;
  }

  return (
    <div className="fc-slot-hover" ref={containerRef}>
      <div
        className="fc-slot-hover-overlay"
        style={{
          height: `${slotRenderHeight}rem`,
          top: offsetTop,
        }}
      >
        <div
          style={{
            background: hexToRgb(theme.palette.primary.main),
          }}
        >
          <AddCircleOutlinedIcon color="primary" />
        </div>
      </div>
    </div>
  );
};

export default memo(CustomDayCellContent);
