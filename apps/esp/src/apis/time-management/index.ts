import { DEFAULT_TIME_POLICIES } from '@esp/constants';

import request from '../axios';
import { IPostUserTimeLog } from '../task-management';
import { IBaseAPIResponse } from '../types';

export const TIME_MANAGEMENT_API_PATH = {
  getAttendanceLogs: '/time-management/v1/attendance-logs',
  exportAttendanceLogs: '/time-management/v1/attendance-logs/export',
  timePolicies: '/time-management/v1/time-policies',
  timeLogExport: 'time-management/v1/timelogs/export',
  registerImportProgress: 'time-management/v1/timelogs/register-import-progress',
  getTimeLogs: 'time-management/v1/timelogs',
  latestSyncTimeLog: 'time-management/v1/timelogs/get-latest-sync-time-log-from-pma',
};

export interface AttendanceLogsFilter {
  employeeIds?: string[];
  startDate?: string;
  endDate?: string;
  remark?: string[];
}

export type TAttendanceRemark =
  | 'No Remark'
  | 'Missing Attendance'
  | 'Missing Check-out'
  | 'Missing Check in'
  | 'Late in'
  | 'Early out'
  | 'Late in & Early out';

export interface IDataAttendanceLog {
  auditDay: string;
  creationTime: string;
  creatorUserId: string;
  deleterUserId: string;
  deletionTime: string;
  earlyOut: number;
  earlyOutAllow: number;
  employeeId: string;
  firstCheckIn: string;
  id: string;
  isDeleted: false;
  lastAuditDay: null;
  lastCheckOut: string;
  lastModificationTime: string;
  lastModifierUserId: string;
  lateIn: number;
  lateInAllow: number;
  leaveHours: number | string;
  remark: TAttendanceRemark;
  shiftId: string;
  shiftName: string;
  workingEndTime: string;
  workingStartTime: string;
}

export interface IResponseDataAttendaceLog {
  data: IDataAttendanceLog[];
  groupCount?: number;
  summary?: number;
  totalCount?: number;
}

export type TResponseGetAttendaceLogs = IBaseAPIResponse<IResponseDataAttendaceLog>;

export const getAttendanceLogs = (params?: string): Promise<TResponseGetAttendaceLogs> => {
  return request.get(`${TIME_MANAGEMENT_API_PATH.getAttendanceLogs}?${params}`);
};

export const exportAttendanceLogs = (body: AttendanceLogsFilter, userId: string) => {
  return request.post(TIME_MANAGEMENT_API_PATH.exportAttendanceLogs, body, {
    headers: {
      userId,
    },
  });
};

export interface ITimePolicies {
  organizationId: string;
  branchId: string;
  statementDate: number;
  allowedLateIn: number;
  allowedEarlyOut: number;
  minimumDurationPerLog: number;
  maximumDurationPerLog: number;
}

export type TReponseGetTimePolicies = IBaseAPIResponse<ITimePolicies>;

export const getTimePolicies = (
  branchId: string,
  organizationId: string
): Promise<TReponseGetTimePolicies> => {
  return request
    .get(
      `${TIME_MANAGEMENT_API_PATH.timePolicies}?branchId=${branchId}&organizationId=${organizationId}`
    )
    .catch(() => ({
      data: DEFAULT_TIME_POLICIES,
    }));
};

export const putTimePolicies = (body: ITimePolicies) => {
  return request.put(TIME_MANAGEMENT_API_PATH.timePolicies, body);
};

export interface IParamExportTimeLog {
  employeeIds: string[];
  startDate?: string;
  endDate?: string;
}

type IResponseExportTimeLog = string[];

export type TReponseGetTimeLogExport = IBaseAPIResponse<IResponseExportTimeLog>;

export const postTimeLogExport = (body: IParamExportTimeLog): Promise<TReponseGetTimeLogExport> => {
  return request.post(TIME_MANAGEMENT_API_PATH.timeLogExport, body);
};

export const registerImportTimeLog = (uploadedFileId: string) => {
  const formData = new FormData();

  formData.append('UploadedFileId', uploadedFileId);

  return request.post(TIME_MANAGEMENT_API_PATH.registerImportProgress, formData);
};

export interface IGetTimeLog {
  id: string;
  employeeId: string;
  sourceId?: string;
  startDate: string;
  endDate: string;
  description: string;
  duration: number;
  taskId: string;
}

export interface IGetTimeLogs {
  data: IGetTimeLog[];
}

export type TResponseGetProgressInformation = IBaseAPIResponse<IGetTimeLogs>;

export const getTimeLogs = (params?: string): Promise<TResponseGetProgressInformation> => {
  return request.get(`${TIME_MANAGEMENT_API_PATH.getTimeLogs}?${params}`);
};

export const putUserTimeLog = (body: IPostUserTimeLog, employeedId: string, id: string) => {
  return request.put(TIME_MANAGEMENT_API_PATH.getTimeLogs, body, {
    headers: {
      employeeId: employeedId,
      id: id,
    },
  });
};

export const deleteUserTimeLog = (params: string, employeedId: string, id: string) => {
  return request.delete(`${TIME_MANAGEMENT_API_PATH.getTimeLogs}/${params}`, {
    headers: {
      employeeId: employeedId,
      userId: id,
    },
  });
};

export const getLatestSyncTimeLog = (employeedId: string) => {
  return request.get(`${TIME_MANAGEMENT_API_PATH.latestSyncTimeLog}?EmployeeId=${employeedId}`);
};
