import { ITimePolicies } from '../apis/time-management/index';

export enum APP_ROUTE {
  LOGIN = '/login',
  STYLE_GUIDE = '/style-guide',
  NO_PERMISSION = '/no-permission',

  HOME = '/',
  TIME_MANAGEMENT = '/time-management',
  SERVICE_MANAGEMENT = '/service-management',
  TASK_MANAGEMENT = '/task-management',
  ADMINISTRATIVE_TOOLS = '/administrative-tools',
  SETTING = '/setting',
  REPORT = '/report',
  IMPORT_EXPORT = '/report/import-export',
  IMPORT = '/report/import-export?tab=import',
  EXPORT = '/report/import-export?tab=export',
  TIME_SHEET = '/timesheet',
}

export const PUBLIC_PATH = [
  APP_ROUTE.LOGIN,
  APP_ROUTE.STYLE_GUIDE,
  APP_ROUTE.NO_PERMISSION,
] as string[];

export const REFRESH_TOKEN_ERROR = 'RefreshAccessTokenError';

export interface IDefaultPageProps {
  params?: IParams;
  searchParams?: ISearchParams;
}

export interface IParams {
  slug: string;
}
export interface ISearchParams {
  [key: string]: string | string[] | undefined;
}

export const DEFAULT_SKIP = 0;
export const DEFAULT_TAKE = 25;
export const IMPORT_EXPORT_ICON_PARAM = 'from-icon';

export enum IMPORT_EXPORT_TYPES {
  ATTENDANCE_LOG_EXPORT = 'Attendance Log Export',
  TIME_LOG_IMPORT = 'Time Log Import',
}

export const DATE_FORMAT = 'DD/MM/YYYY';

export const MAXIMUM_TAKE_RECORD = 100000;

export const DEFAULT_TIME_POLICIES: ITimePolicies = {
  organizationId: '',
  branchId: '',
  statementDate: 15,
  allowedLateIn: 5,
  allowedEarlyOut: 5,
  minimumDurationPerLog: 5,
  maximumDurationPerLog: 600,
};
