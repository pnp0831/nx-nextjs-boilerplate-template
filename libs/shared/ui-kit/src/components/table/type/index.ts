import { TableCellProps } from '@mui/material/TableCell';
import { TableContainerProps } from '@mui/material/TableContainer';
import { ReactNode, RefObject } from 'react';
import { VariableSizeList } from 'react-window';

export interface HeadCell extends Omit<TableCellProps, 'id'> {
  id: string | number;
  label: string | React.ReactNode;
  sx?: React.CSSProperties;
  sortable?: boolean;
}

export interface Column<T> extends Omit<TableCellProps, 'width' | 'hidden' | 'id'> {
  id: string | number;
  render?: (data: T) => ReactNode;
  sx?: React.CSSProperties;
  label: string | React.ReactNode;
  sortable?: boolean;
  width?: number | null | undefined;
  minWidth?: number;
  hidden?: boolean | null | undefined;
  resizable?: boolean;
  sortingId?: string;
}

export interface Data extends Pick<TableCellProps, 'align'> {
  id: string | number;
  [key: string]: string | number | unknown;
  option?: {
    showCheckbox?: boolean;
  };
}

export interface TablePaginationProps {
  bottomPosition?: {
    direction?: 'left' | 'right';
    action?: ReactNode;
  };
  totalItems: number;
  pageSize: number;
  currentPage: number;

  onPageChange?: (currentPage: number) => void;
}

export interface TablePageSizeProps<T> extends SettingColumnsProps<T> {
  topPosition?: {
    direction?: 'left' | 'right';
    action?: ReactNode;
  };
  showPageSize?: boolean;
  showTableSetting?: boolean;
  pageSize: number;
  handleSetPageSize: (pageSize: number) => void;
  pageSizeArray: Array<number>;
}

export interface ESPTableContainerProps extends TableContainerProps {
  tableEnhancement?: boolean;
  checkboxSelection?: boolean;
  rowClick?: boolean;
  stickyHeader?: boolean;
  showTableHeader?: boolean;
}

//js.devexpress.com/Documentation/ApiReference/Data_Layer/CustomStore/LoadOptions/#filter

export enum CondOperator {
  EQUALS = '=',
  NOT_EQUALS = '<>',
  GREATER_THAN = '>',
  LOWER_THAN = '<',
  GREATER_THAN_EQUALS = '>=',
  LOWER_THAN_EQUALS = '<=',
  STARTS = 'startswith',
  ENDS = 'endswith',
  CONTAINS = 'contains',
  EXCLUDES = 'notcontains',
  OR = 'or',
  AND = 'and',
}

export interface ITotalSummary {
  selector: string;
  summaryType: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

export type IGroupSummary = ITotalSummary;

export interface ISort {
  selector: string;
  desc: boolean;
}

export interface IGroup {
  selector: string;
  desc: boolean;
  groupInterval: string;
  isExpanded: boolean;
}

export interface ILoadOptions {
  page?: number;

  // Load options
  // https://js.devexpress.com/Documentation/ApiReference/Data_Layer/CustomStore/LoadOptions/

  requireTotalCount?: boolean;
  requireGroupCount?: boolean;
  isCountQuery?: boolean;
  isSummaryQuery?: boolean;
  skip?: number;
  take?: number;
  sort?: ISort[];
  group?: IGroup[];
  filter?: unknown[];
  totalSummary?: ITotalSummary[];
  groupSummary?: IGroupSummary[];

  select?: string[];
  preSelect?: string[];
  remoteSelect?: boolean;
  remoteGrouping?: boolean;
  expandLinqSumType?: boolean;

  primaryKey?: string[];
  defaultSort?: string;
  stringToLower?: boolean;
  paginateViaPrimaryKey?: boolean;
  sortByPrimaryKey?: boolean;
  allowAsyncOverSync?: boolean;
}

export const LOAD_OPTIONS_KEYS: Array<keyof ILoadOptions> = [
  'page',
  'requireTotalCount',
  'requireGroupCount',
  'isCountQuery',
  'isSummaryQuery',
  'skip',
  'take',
  'sort',
  'group',
  'filter',
  'totalSummary',
  'groupSummary',
  'select',
  'preSelect',
  'remoteSelect',
  'remoteGrouping',
  'expandLinqSumType',
  'primaryKey',
  'defaultSort',
  'stringToLower',
  'paginateViaPrimaryKey',
  'sortByPrimaryKey',
  'allowAsyncOverSync',
];

export type Order = 'asc' | 'desc' | undefined;

export interface ESPTableProps<T> extends TableContainerProps {
  data?: T[];
  columns?: Column<T>[];

  checkboxSelection?: boolean;
  showTableSetting?: boolean;
  showTableHeader?: boolean;

  rowClick?: (event: React.MouseEvent<unknown>, row: Data) => void;

  showPageSize?: boolean;

  topPosition?: {
    direction?: 'left' | 'right';
    action?: ReactNode;
  };

  bottomPosition?: {
    direction?: 'left' | 'right';
    action?: ReactNode;
  };

  tableName?: string | undefined;

  defaultPageSize?: number;

  pageSizeOptions?: number[];

  onLoadOptionsChange?: (loadOptions: ILoadOptions, extendParams?: IExtendParams) => void;
  totalItems?: number;

  loading?: boolean | undefined;

  defaultSort?: {
    field: string;
    order: Order;
    sortingId?: string;
  };

  funcRef?: RefObject<{ resetPage?: () => void }>;
  showPagination?: boolean;
  minHeight?: number | string;
}

export interface IExtendParams {
  [key: string]: string | number | string[] | number[];
}

export interface SettingColumnsProps<T> {
  columns: Column<T>[];
  settingColumns: Column<T>[];
  setSettingColumns: React.Dispatch<React.SetStateAction<ISettingColumns<T>>>;
}

export interface VirtualTableContextProps<T> {
  refTableHeader: {
    current: {
      [id: string | number]: Partial<HTMLElement> | null;
    };
  };
  showTableHeader?: boolean;
  checkboxSelection?: boolean;

  visibleRows: Array<T | Data>;

  settingColumns: Column<T>[];

  sortInfo: {
    field: string;
    order: Order;
  };
  handleRequestSort: (event: React.MouseEvent<unknown>, property: string | number) => void;
  columnWidths: {
    [key: string]: number;
  };
  setColumnWidths: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  currentPage?: number;
  gridRef?: React.RefObject<VariableSizeList<T>>;

  setSelectedRows: (selected: { [key: string]: boolean }) => void;
  selectedRows: { [key: string]: boolean };

  columnMinWidth: number;
  columnMaxWidth: number;
  loading?: boolean | undefined;

  tableRef?: React.MutableRefObject<HTMLDivElement | null>;
  setTableRef?: (ref: HTMLDivElement | null) => void;
}

export type ISettingColumns<T> = Column<T>[];
