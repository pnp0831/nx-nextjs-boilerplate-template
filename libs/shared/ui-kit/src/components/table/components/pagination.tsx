import Box from '@mui/material/Box';
import { memo, useMemo } from 'react';

import { ESPPagination } from '../../pagination/pagination';
import { ESPTypography } from '../../typography/typography';
import { TablePaginationProps } from '../type/index';

export const TablePagination = memo(
  ({ bottomPosition, onPageChange, pageSize, totalItems, currentPage }: TablePaginationProps) => {
    const displayInfo = useMemo(() => {
      const currentRowsOfPages = pageSize * currentPage;
      return {
        totalRows: totalItems,
        displayRows: totalItems ? pageSize * (currentPage - 1) + 1 : 0,
        maxRowsOfPage: currentRowsOfPages > totalItems ? totalItems : currentRowsOfPages,
      };
    }, [pageSize, currentPage, totalItems]);

    const handleSetPagePagination = (
      _event: React.ChangeEvent<HTMLInputElement>,
      currentPage: number
    ) => {
      if (typeof onPageChange === 'function') {
        onPageChange(currentPage);
      }
    };

    const pageCount = Math.ceil(totalItems / pageSize);

    return (
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        flexDirection={bottomPosition?.direction === 'left' ? 'row' : 'row-reverse'}
      >
        <Box display={'flex'} sx={{ marginTop: '1rem' }} alignItems={'center'}>
          <ESPTypography variant="regular_m" sx={{ marginRight: '1rem' }}>
            Showing {displayInfo.displayRows} to {displayInfo.maxRowsOfPage} of{' '}
            {displayInfo.totalRows} entries
          </ESPTypography>
          <ESPPagination
            page={currentPage || 0}
            size={'medium'}
            count={pageCount || 0}
            onChange={(event, pagination) =>
              handleSetPagePagination(
                event as React.ChangeEvent<HTMLInputElement>,
                pagination as number
              )
            }
          />
        </Box>
        {bottomPosition?.action}
      </Box>
    );
  }
);
