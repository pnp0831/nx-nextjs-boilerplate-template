'use client';

import './table.scss';

import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import useWindowResize from '@ui-kit/hooks/useWindowResize';
import clsx from 'clsx';
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

import { getHtmlFontSize } from '../../helpers/index';
import { ESPCheckbox } from '../checkbox/checkbox';
import { getComparator, stableSortWithPaging } from '../table/helpers';
import { TableContainerComponent } from './components';
import { OuterElement, useResetCache, VirtualTableContextProvider } from './components';
import { TablePageSize } from './components/page-size';
import { TablePagination } from './components/pagination';
import { Column, Data } from './type';
import { ESPTableProps, ISettingColumns, Order } from './type';

const DEFAULT_ITEM_HEIGHT = 3; //rem
const COLUMN_MIN_WIDTH = 150;
const COLUMN_MAX_WIDTH = COLUMN_MIN_WIDTH * 5;
const DEFAULT_PAGE_SIZE_ARRAY = [10, 25, 50, 100];

const useTableMinHeight = () => {
  const { height } = useWindowResize();

  const result = useMemo(() => {
    const htmlFontSize = getHtmlFontSize();
    const itemHeight = htmlFontSize * DEFAULT_ITEM_HEIGHT;
    let itemCountBaseOnHeight = 0;

    switch (true) {
      case height > 1400:
        itemCountBaseOnHeight = 20;
        break;
      case height > 1200:
        itemCountBaseOnHeight = 17;
        break;
      case height > 1080:
        itemCountBaseOnHeight = 14;
        break;
      case height > 1024:
        itemCountBaseOnHeight = 13;
        break;
      case height > 860:
        itemCountBaseOnHeight = 10;
        break;
      case height > 480:
        itemCountBaseOnHeight = 9;
        break;

      default:
        itemCountBaseOnHeight = 9;
        break;
    }

    const tableMinHeight = itemCountBaseOnHeight * itemHeight;

    return {
      itemHeight,
      tableMinHeight,
    };
  }, [height]);

  return result;
};

const calculateHeightTable = (visibleRows: number, itemHeight: number, tableMinHeight: number) => {
  let visibleHeight = visibleRows * itemHeight;

  if (visibleHeight > tableMinHeight) {
    return (visibleHeight = tableMinHeight);
  }
  return visibleHeight;
};

const SORT_ORDER: Record<'NONE' | 'ASC' | 'DESC', Order> = {
  NONE: undefined,
  ASC: 'asc',
  DESC: 'desc',
};

export function ESPTable<T>({
  tableName,

  data = [],
  columns = [],

  showTableHeader = true,
  showTableSetting,
  checkboxSelection,

  showPageSize = true,

  topPosition = {
    direction: 'left',
  },
  bottomPosition = {
    direction: 'right',
  },

  rowClick,

  onLoadOptionsChange,
  defaultPageSize = 25,
  totalItems,

  loading,

  defaultSort,

  funcRef,

  pageSizeOptions,

  showPagination = true,
  minHeight,
  ...props
}: ESPTableProps<T>) {
  const { tableMinHeight, itemHeight } = useTableMinHeight();
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedRows, setSelectedRows] = useState<{
    [key: string]: boolean;
  }>({});

  const [pageOptions, setPageOptions] = useState<{ pageSize: number; currentPage: number }>({
    pageSize: defaultPageSize,
    currentPage: 1,
  });

  const [sortInfo, setSortInfo] = useState<{
    field: string;
    order: Order;
    sortingId?: string;
  }>(
    defaultSort || {
      field: '',
      order: 'asc',
    }
  );

  // const [sortOrder, setSortOrder] = useState<number>(0);

  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});

  const [settingColumns, setSettingColumns] = useState<ISettingColumns<T>>(() => {
    return columns.map((column) => ({ ...column, hidden: column.hidden }));
  });

  const refTableHeader = useRef<{
    [id: string | number]: HTMLElement | null;
  }>({});

  const gridRef = useResetCache(data.length);

  useEffect(() => {
    if (refTableHeader.current && columns.length) {
      setSettingColumns(
        columns.map((column) => ({
          ...column,
          width: column.width || refTableHeader.current?.[column.id]?.offsetWidth,
          hidden: column.hidden,
        }))
      );
    }
  }, [columns, columns.length]);

  useEffect(() => {
    if (tableName && showTableSetting) {
      localStorage.setItem(tableName, JSON.stringify(settingColumns));
    }
  }, [settingColumns, showTableSetting, tableName]);

  useEffect(() => {
    if (gridRef) {
      gridRef.current?.resetAfterIndex(0);
    }
  }, [pageOptions, sortInfo, gridRef]);

  const handleRequestSort = useCallback(
    (_: React.MouseEvent<unknown>, property: keyof Data) => {
      let newSortOrder: Order;
      let sortingIdOfColumn = columns.find((c) => c.id === property)?.sortingId;
      const isSortingOnTheSameColumn = sortInfo.field === property;
      if (isSortingOnTheSameColumn) {
        if (sortInfo.order === SORT_ORDER.ASC) {
          newSortOrder = SORT_ORDER.DESC;
        } else {
          property = '';
          sortingIdOfColumn = '';
          newSortOrder = SORT_ORDER.NONE;
        }
      } else {
        newSortOrder = SORT_ORDER.ASC;
      }

      setSortInfo((sortInfo) => {
        return {
          ...sortInfo,
          field: property as string,
          order: newSortOrder,
          sortingId: sortingIdOfColumn,
        };
      });

      setPageOptions((pageOptions) => {
        return { pageSize: pageOptions.pageSize, currentPage: 1 };
      });
    },
    [columns, sortInfo.field, sortInfo.order]
  );

  const handleSetPageSize = (pageSize: number) => {
    setPageOptions({
      pageSize,
      currentPage: 1,
    });
  };

  const onPageChange = useCallback((page: number) => {
    setPageOptions((pageOptions) => ({ ...pageOptions, currentPage: page }));
  }, []);

  const visibleRows = useMemo(() => {
    if (typeof onLoadOptionsChange !== 'function' && showPagination) {
      const funcComparator =
        sortInfo.field && sortInfo.order
          ? getComparator(sortInfo.order, sortInfo.field)
          : undefined;

      const { pageSize, currentPage } = pageOptions;

      return stableSortWithPaging(data as Data[], pageSize, currentPage, funcComparator) as Data[];
    }

    return data;
  }, [onLoadOptionsChange, showPagination, data, sortInfo.field, sortInfo.order, pageOptions]);

  const handleClick = (_: React.MouseEvent<unknown>, id: string | number) => {
    const selectedIndex = selectedRows[id];

    const newSelected = {
      ...selectedRows,
    };

    if (!selectedIndex) {
      newSelected[id] = true;
    }

    if (selectedIndex) {
      delete newSelected[id];
    }

    setSelectedRows(newSelected);
  };

  const renderRow = useCallback(
    (row: Data, isItemSelected: boolean, labelId: string) => {
      return (
        <>
          {checkboxSelection && (
            <TableCell padding="checkbox">
              {(checkboxSelection && !row.option) ||
              (checkboxSelection && row.option?.showCheckbox) ? (
                <Box width="3rem">
                  <ESPCheckbox
                    color="primary"
                    checked={isItemSelected}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    inputProps={{
                      'aria-labelledby': labelId as string,
                    }}
                  />
                </Box>
              ) : (
                <Box width="3rem" />
              )}
            </TableCell>
          )}

          {settingColumns.map(
            (
              {
                id,
                render,
                align,
                hidden,
                resizable,
                width: columnWidth,
                minWidth,
                sortable,
                sortingId,
                ...column
              }: Column<T>,
              colIndex
            ) => {
              const width = columnWidths[id] || (refTableHeader.current[id]?.offsetWidth as number);

              if (hidden) {
                return null;
              }

              return (
                <TableCell
                  padding="none"
                  {...column}
                  key={`${id}-${colIndex}`}
                  align={align || 'left'}
                >
                  <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                    <Box
                      sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        width,
                        padding: '0 0.725rem',
                        minWidth: minWidth || COLUMN_MIN_WIDTH,
                      }}
                    >
                      {(typeof render === 'function' ? render(row as T) : row[id]) as ReactNode}
                    </Box>
                  </Box>
                </TableCell>
              );
            }
          )}
        </>
      );
    },
    [checkboxSelection, columnWidths, settingColumns]
  );

  const renderBody = (props: ListChildComponentProps) => {
    const { data, index, style } = props;

    const row = data[index];

    const isItemSelected = !!selectedRows[row.id];
    const labelId = `enhanced-table-checkbox-${row.id}`;

    const { width, ...inlineStyle } = {
      ...style,
      top: Number(style?.top || 0) + (showTableHeader ? itemHeight : 0),
    };

    return (
      <TableRow
        hover
        onClick={(event: React.MouseEvent<unknown>) => {
          if (typeof rowClick === 'function') {
            rowClick(event, row);
          }
          if (
            (checkboxSelection && !row.option) ||
            (checkboxSelection && row.option?.showCheckbox)
          ) {
            handleClick(event, row.id);
          }
        }}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        style={{
          ...inlineStyle,
        }}
      >
        {renderRow(row, isItemSelected, labelId)}
      </TableRow>
    );
  };

  useEffect(() => {
    if (typeof onLoadOptionsChange === 'function') {
      const { currentPage, pageSize } = pageOptions;
      onLoadOptionsChange({
        requireTotalCount: true,
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        sort: sortInfo?.field
          ? [
              {
                // normally, we would use the sortInfo.field/columnId to send to BE
                // but there are case, we would send them a sortingId instead.
                // Example: column Date in Attendance Log
                selector: sortInfo.sortingId ?? (sortInfo.field as string),
                desc: sortInfo.order === SORT_ORDER.DESC,
              },
            ]
          : undefined,
      });
    }
  }, [onLoadOptionsChange, sortInfo, pageOptions]);

  useEffect(() => {
    if (funcRef?.current) {
      funcRef.current.resetPage = () =>
        setPageOptions((pageOptions) => {
          return { pageSize: pageOptions.pageSize, currentPage: 1 };
        });
    }
  }, [funcRef, setPageOptions]);

  return (
    <VirtualTableContextProvider
      value={{
        refTableHeader,
        showTableHeader,
        checkboxSelection,
        visibleRows,

        settingColumns,
        sortInfo,

        handleRequestSort,
        columnWidths,
        setColumnWidths,

        gridRef,

        setSelectedRows,
        selectedRows,

        columnMinWidth: COLUMN_MIN_WIDTH,
        columnMaxWidth: COLUMN_MAX_WIDTH,
        loading,
      }}
    >
      <div
        className={clsx('table-enhancement', {
          'table-enhancement__no-header': !showTableHeader,
        })}
      >
        <TablePageSize
          showTableSetting={showTableSetting}
          topPosition={topPosition}
          pageSize={pageOptions.pageSize}
          showPageSize={showPageSize}
          handleSetPageSize={handleSetPageSize}
          setSettingColumns={
            setSettingColumns as Dispatch<SetStateAction<ISettingColumns<unknown>>>
          }
          columns={columns as Column<unknown>[]}
          settingColumns={settingColumns as Column<unknown>[]}
          pageSizeArray={pageSizeOptions || DEFAULT_PAGE_SIZE_ARRAY}
        />

        <TableContainerComponent
          sx={{ overflowY: 'hidden', maxHeight: 'unset' }}
          checkboxSelection={checkboxSelection}
          rowClick={typeof rowClick === 'function' || checkboxSelection}
          tableEnhancement
          ref={tableContainerRef}
          {...props}
        >
          <VariableSizeList
            height={calculateHeightTable(visibleRows.length, itemHeight, tableMinHeight)}
            width={'100%'}
            itemSize={() => itemHeight}
            itemCount={visibleRows.length}
            // @ts-expect-error: IGNORE
            outerElementType={OuterElement}
            ref={gridRef}
            itemData={visibleRows}
            // empty data
            style={{ minHeight: minHeight || tableMinHeight }}
          >
            {renderBody}
          </VariableSizeList>
        </TableContainerComponent>

        {showPagination && (
          <TablePagination
            bottomPosition={bottomPosition}
            onPageChange={onPageChange}
            pageSize={pageOptions.pageSize}
            totalItems={totalItems as number}
            currentPage={pageOptions.currentPage}
          />
        )}
      </div>
    </VirtualTableContextProvider>
  );
}

export default ESPTable;
