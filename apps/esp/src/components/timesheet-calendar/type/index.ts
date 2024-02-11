import { IGetTimeLog, TAttendanceRemark } from '@esp/apis/time-management';
import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';

// TODO: Defined type

export interface Data {
  [key: string]: unknown | string | number;
}

export interface Configs {
  required: string | ReactNode | null;
  finished: string | ReactNode | null;
}

export interface IPropertyAttendanceLog {
  start: string;
  end: string;
  remark: TAttendanceRemark;
}

export interface IAttendanceLogs {
  [date: string]: IPropertyAttendanceLog;
}

export type IDetailLoggedTime = IGetTimeLog;

export interface IEventData {
  [date: string]: {
    logged: number;
    overrtime: number;
    rawData?: IDetailLoggedTime[];
  };
}
export interface Event {
  data: IEventData;
  taskId: string;
  totalLogged?: number;
  overtimeLogged?: number;

  name?: string;
  isSubtotal?: boolean;
}

export interface ESPTimesheetCalendarProps {
  currentDate?: Dayjs;
  onDateChange?: (date: Dayjs) => void;
  onView?: (event: Event, date: Dayjs) => void;
  onAdd?: (event: Event, date: Dayjs) => void;
  format?: string;
  extendHour?: boolean;
  events?: Event[];
  attendanceLogs?: IAttendanceLogs;
  configs?: Configs;
  timesheetInfo?: ReactNode;
  timesheetInfoData?: (event: Event) => ReactNode;
  minWidth?: string;

  logTimeElement?: ReactNode;
  settingElement?: ReactNode;

  employeeName?: string | ReactNode;

  loading?: boolean;

  lackingData?: IEventData;
  statementDate?: Dayjs;
  latestSyncText?: string;
}
