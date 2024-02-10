'use client';

import { Box } from '@mui/material';
import useWindowResize from '@ui-kit/hooks/useWindowResize';
import { useState } from 'react';

import { ESPButton } from '../../button/button';
import { ESPCheckbox } from '../../checkbox/checkbox';
import { SettingColumnsProps } from '../type';
import { useTableContext } from '.';

export const SettingsColumns = <T,>({
  columns,
  setSettingColumns,
  settingColumns,
}: SettingColumnsProps<T>) => {
  const { gridRef } = useTableContext();
  const [open, setOpen] = useState(false);

  const triggerTableRerender = () => {
    setTimeout(() => {
      if (gridRef?.current) {
        gridRef.current?.resetAfterIndex(0);
      }
    }, 0);
  };

  useWindowResize(() => {
    triggerTableRerender();
  });

  const handleCheckboxClick = (checked: boolean, itemIndex: string | number) => {
    const updatedItems = settingColumns.map((item) => {
      if (item.id === itemIndex) {
        item.hidden = !checked;
      }

      return item;
    });

    triggerTableRerender();

    return setSettingColumns(updatedItems);
  };

  const filterCheckedItem = (id: string | number) => {
    return settingColumns.filter((item) => item.id === id && !item.hidden);
  };

  return (
    <Box>
      <ESPButton onClick={() => setOpen(!open)}>Settings</ESPButton>
      <Box>
        {open &&
          columns.map((item, index) => {
            const key = `${item.id}-${index}`;
            return (
              <div key={key}>
                <ESPCheckbox
                  color="primary"
                  checked={filterCheckedItem(item.id).length > 0}
                  onChange={(event) => {
                    handleCheckboxClick(event.currentTarget.checked, item.id);
                  }}
                  inputProps={{
                    'aria-label': `${item.id}` as string,
                  }}
                />
                {item.id}
              </div>
            );
          })}
      </Box>
    </Box>
  );
};
