import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { memo } from 'react';

import { ESPDropdown } from '../../dropdown/dropdown';
import { ESPTypography } from '../../typography/typography';
import { TablePageSizeProps } from '../type/index';
import { SettingsColumns } from './setting-column';

function TablePageSizeComponent<T>({
  showPageSize,
  topPosition,
  pageSize,
  handleSetPageSize,
  setSettingColumns,
  columns,
  settingColumns,
  pageSizeArray,
  showTableSetting,
}: TablePageSizeProps<T>) {
  if (!showPageSize) {
    return null;
  }

  return (
    <Box
      className="table-enhancement_action"
      flexDirection={topPosition?.direction === 'left' ? 'row' : 'row-reverse'}
      mb="1rem"
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        mt={topPosition?.action ? '2rem' : 0}
        sx={{ color: '#7C7C7C' }}
      >
        <ESPTypography variant="regular_m">Show</ESPTypography>
        <ESPDropdown
          displayEmpty={false}
          size="medium"
          sx={{ width: '4.5rem', margin: '0 0.5rem' }}
          value={pageSize}
          onChange={(event) => handleSetPageSize(event.target.value as number)}
        >
          {pageSizeArray.map((size: number, index) => (
            <MenuItem value={size} key={`${size}-${index}`}>
              {size}
            </MenuItem>
          ))}
        </ESPDropdown>
        <ESPTypography variant="regular_m">entries</ESPTypography>
      </Box>
      <Box display={'flex'} alignItems={'center'} flexGrow={1} justifyContent={'flex-end'}>
        {topPosition?.action}
        {showTableSetting && (
          <Box>
            <SettingsColumns
              columns={columns}
              setSettingColumns={setSettingColumns}
              settingColumns={settingColumns}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

const TablePageSize = memo(TablePageSizeComponent);

export { TablePageSize };
