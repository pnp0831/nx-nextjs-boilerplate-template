import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow, { TableRowProps } from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import visuallyHidden from '@mui/utils/visuallyHidden';
import usePrevious from '@ui-kit/hooks/usePrevious';
import clsx from 'clsx';
import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { VariableSizeList } from 'react-window';

import { ESPCheckbox } from '../../checkbox/checkbox';
import { ESPLoading } from '../../loading/loading';
import { ESPNotAvaliable } from '../../not-available/not-available';
import { VirtualTableContextProps } from '../type';
import { Column, Data, ESPTableContainerProps } from '../type/index';

export const TableContainerComponent = styled(TableContainer, {
  shouldForwardProp: (prop) =>
    prop !== 'checkboxSelection' &&
    prop !== 'rowClick' &&
    prop !== 'tableEnhancement' &&
    prop !== 'stickyHeader' &&
    prop !== 'showTableHeader',
})<ESPTableContainerProps>(
  ({ theme, checkboxSelection, showTableHeader, rowClick, tableEnhancement, stickyHeader }) => {
    const commonStyle = {
      td: {
        '&:first-of-type': {
          // paddingLeft: checkboxSelection ? 'unset' : '0.75rem',
          // paddingRight: 0,
        },
        '&:last-child': {
          // paddingRight: tableEnhancement ? '0.1rem' : '0.75rem',
        },
      },
      th: {
        '&:first-of-type': {
          // paddingLeft: 0,
          // paddingRight: 0,
        },
        '&:last-child': {
          // paddingRight: tableEnhancement ? '0.1rem' : '0.75rem',
        },
      },
    };
    return {
      position: 'relative',
      border: `0.0625rem solid ${theme.palette.gray_medium.main}`,
      borderRadius: '0.25rem',
      'th,td': {
        borderColor: theme.palette.gray_medium.main,
        padding: 0,
        height: '3rem',
        '.MuiCheckbox-root': {
          backgroundColor: 'unset',
          paddingRight: '0',
        },
      },
      thead: {
        th: {
          ...theme.typography.bold_m,
          ...commonStyle.th,
        },
        td: {
          ...theme.typography.bold_m,
          ...commonStyle.td,
        },
      },
      tbody: {
        td: {
          boxShadow: '0px 1px 0px #ECECEE',
          ...theme.typography.regular_m,
          ...commonStyle.td,
        },
        th: {
          boxShadow: '0px 1px 0px #ECECEE',
          ...theme.typography.regular_m,
          ...commonStyle.th,
        },

        tr: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.gray_light.main,
          },

          td: {
            boxShadow: 'none',
            border: 'none',
          },

          '&:hover, &.Mui-selected, &.Mui-selected:hover': {
            background: rowClick ? '#F6F6F9' : 'unset',
          },

          '&.MuiTableRow-hover:hover': {
            background: theme.palette.gray_medium.main,
          },

          cursor: rowClick ? 'pointer' : 'default',

          ':last-child': {
            'td,th': {
              borderBottom: 'none',
            },
          },
        },
      },
    };
  }
);

export function useResetCache(data: unknown) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

export const VirtualTableContext = React.createContext<VirtualTableContextProps<any>>({
  refTableHeader: {
    current: {},
  },
  showTableHeader: false,
  checkboxSelection: false,
  visibleRows: [],

  settingColumns: [],
  sortInfo: {
    field: '',
    order: 'asc',
  },
  columnWidths: {},
  handleRequestSort: () => {},
  setColumnWidths: () => {},

  setSelectedRows: (selectedRow: { [key: string]: boolean }) => {},
  selectedRows: {},
  columnMinWidth: 0,
  columnMaxWidth: 500,
  loading: false,
});

export const VirtualTableContextProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: VirtualTableContextProps<any>;
}) => {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const setTableRef = useCallback((ref: HTMLDivElement | null) => {
    tableRef.current = ref;
  }, []);

  return (
    <VirtualTableContext.Provider value={{ ...value, setTableRef, tableRef }}>
      {children}
    </VirtualTableContext.Provider>
  );
};

export const useTableContext = () => useContext(VirtualTableContext);

export const OuterElement = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function Outer({ children, style, ...rest }, ref) {
    const { loading, visibleRows, setTableRef } = useContext(VirtualTableContext);

    const refTable = useRef<HTMLDivElement | null>(null);

    const previousLoading = usePrevious(loading);

    const isShowEmptyData =
      typeof previousLoading !== 'undefined' && !loading && !visibleRows.length;

    const sx = {
      top: `calc(3rem + ${refTable.current?.scrollTop || 0}px)`,
      left: refTable.current?.scrollLeft || 0,
      width: refTable.current?.offsetWidth || '100%',
      height: `calc(${refTable.current?.offsetHeight || 432}px - 3rem)`,
    };

    useEffect(() => {
      if (refTable && setTableRef) {
        setTableRef(refTable.current);
      }
    }, [refTable, setTableRef]);

    return (
      <>
        {isShowEmptyData && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              display: 'grid',
              placeItems: 'center',
              img: {
                objectFit: 'cover',
              },
            }}
          >
            <ESPNotAvaliable width={180} height={120} />
          </Box>
        )}

        <div
          {...rest}
          ref={refTable}
          style={{
            ...style,
            overflow: loading ? 'hidden' : 'auto',
          }}
          className={clsx('scrollbar-trigger-visibility', 'table-scrollbar')}
        >
          <Table aria-labelledby="tableTitle" stickyHeader sx={{ position: 'absolute' }}>
            <TableHeader />

            {React.Children.map(children, (child: any, key) => {
              return (
                <TableBody style={child.props.style} key={key}>
                  {loading && (
                    <tr>
                      <td>
                        <ESPLoading loading={loading} sx={sx} />
                      </td>
                    </tr>
                  )}
                  {child.props.children}
                </TableBody>
              );
            })}
          </Table>
        </div>
      </>
    );
  }
);

export const TableHeader = <T,>() => {
  const {
    refTableHeader,
    showTableHeader,
    checkboxSelection,
    visibleRows,
    setSelectedRows,
    settingColumns,
    sortInfo,
    handleRequestSort,
    columnWidths,
    setColumnWidths,
    selectedRows,
    currentPage,
    columnMaxWidth,
    columnMinWidth,
    tableRef,
  } = useContext(VirtualTableContext);

  const createSortHandler = useCallback(
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    },
    [handleRequestSort]
  );

  useEffect(() => {
    setSelectedRows({});
  }, [currentPage, setSelectedRows]);

  const rowCountSelected = visibleRows.filter((row) => row.option?.showCheckbox === true).length;
  const numCountSelected = Object.keys(selectedRows).filter((key) => selectedRows[key]).length;

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = visibleRows.reduce((acc, cur) => {
          if (!cur.option || cur.option?.showCheckbox === true) {
            return { ...acc, [cur.id]: true };
          }

          return { ...acc, [cur.id]: false };
        }, {});

        return setSelectedRows(newSelected);
      }

      return setSelectedRows({});
    },
    [setSelectedRows, visibleRows]
  );

  const handleColumnResizeStart = useCallback(
    (e: React.MouseEvent, columnId: string | number, isLastColumn?: boolean) => {
      e.preventDefault();
      const startX = e.clientX;

      const initialWidth =
        columnWidths[columnId] ||
        (refTableHeader.current[columnId] as { offsetWidth: number })?.offsetWidth;

      const handleColumnResize = (e: MouseEvent) => {
        let width = initialWidth + e.clientX - startX;

        if (width < columnMinWidth) {
          width = columnMinWidth;
        }

        if (width > columnMaxWidth) {
          width = columnMaxWidth;
        }

        if (tableRef?.current && isLastColumn) {
          const extendsWidth = width - initialWidth;

          if (extendsWidth > 0) {
            tableRef.current.scrollTo({
              left: tableRef.current.scrollLeft + extendsWidth,
              top: tableRef.current.scrollTop,
            });
          }
        }

        setColumnWidths((prevWidths) => ({
          ...prevWidths,
          [columnId]: width,
        }));
      };

      const handleColumnResizeEnd = () => {
        document.removeEventListener('mousemove', handleColumnResize);
        document.removeEventListener('mouseup', handleColumnResizeEnd);
      };

      document.addEventListener('mousemove', handleColumnResize);
      document.addEventListener('mouseup', handleColumnResizeEnd);
    },
    [columnMaxWidth, columnMinWidth, columnWidths, refTableHeader, setColumnWidths, tableRef]
  );

  const header = useMemo(() => {
    const sx = showTableHeader
      ? {}
      : {
          visibility: 'hidden',
        };
    return (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>
        <TableHead sx={sx}>
          <TableRow>
            {checkboxSelection && (
              <TableCell padding="checkbox" sx={{ width: '3rem' }}>
                <Box width="3rem">
                  <ESPCheckbox
                    color="primary"
                    indeterminate={
                      Object.keys(selectedRows).length > 0 &&
                      rowCountSelected > 0 &&
                      numCountSelected < rowCountSelected
                    }
                    checked={rowCountSelected > 0 && numCountSelected === rowCountSelected}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }}
                  />
                </Box>
              </TableCell>
            )}

            {settingColumns.map((headCell: Column<T>, index: number) => {
              const width = columnWidths[headCell.id];

              if (headCell.hidden) {
                return null;
              }

              return (
                <TableCell
                  className={headCell.className}
                  key={`${headCell.id}-${index}`}
                  align={headCell.align || 'left'}
                  sx={{
                    ...headCell.sx,
                    // minWidth: headCell.minWidth || columnMinWidth,
                  }}
                  ref={(el) => {
                    if (el) {
                      refTableHeader.current = {
                        ...refTableHeader.current,
                        [headCell.id]: el,
                      };
                    }
                  }}
                >
                  <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                    <Box
                      sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        paddingLeft: '0.725rem',
                        width,
                        minWidth: headCell.minWidth || columnMinWidth,
                      }}
                    >
                      {headCell.sortable ? (
                        <TableSortLabel
                          active={sortInfo.field === headCell.id}
                          direction={sortInfo.field === headCell.id ? sortInfo.order : 'asc'}
                          onClick={createSortHandler(headCell.id)}
                          data-testid="table-enhancement-sorting"
                        >
                          {headCell.label}
                          {sortInfo.field === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                              {sortInfo.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        headCell.label
                      )}
                    </Box>
                    {headCell.resizable && (
                      <Box
                        className="resize-handle"
                        onMouseDown={(e) =>
                          handleColumnResizeStart(
                            e,
                            headCell.id,
                            index === settingColumns.length - 1
                          )
                        }
                      />
                    )}
                  </Box>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
      </>
    );
  }, [
    showTableHeader,
    checkboxSelection,
    selectedRows,
    rowCountSelected,
    numCountSelected,
    handleSelectAllClick,
    settingColumns,
    columnWidths,
    columnMinWidth,
    sortInfo.field,
    sortInfo.order,
    createSortHandler,
    refTableHeader,
    handleColumnResizeStart,
  ]);

  return header;
};

export const CustomTableRow = (props: TableRowProps) => {
  return (
    <TableRow
      {...props}
      sx={{
        ...props.sx,
        '&:nth-of-type(odd)': {
          backgroundColor: (theme) => theme.palette.action.hover,
        },
      }}
    />
  );
};
