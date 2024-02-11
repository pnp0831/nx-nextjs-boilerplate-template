import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import { IDetailLoggedTime } from '@esp/components/timesheet-calendar';
import { ILoadOptions } from '@ui-kit/components/table/type';
import { Dayjs } from 'dayjs';
import { SetStateAction } from 'react';

import {
  IDataLogTimeProps,
  IOnSubmitParams,
  TasksOption,
} from './(main-components)/log-time-modal/log-time-modal.type';

export interface ITimesheetFormData {
  units?: IOrganizationUnitOptions;
  startDate: string;
  endDate: string;
}

export interface IParamsOptions {
  employeeIds?: string[];
  startDate?: string;
  endDate?: string;
}

export interface IUseGetTimeLogs {
  loadOptions: ILoadOptions & IParamsOptions;
  format: string;
}

export type TOnSubmitReason = 'delete' | 'edit' | 'add';

export type TOnSubmitCallback = (data: IOnSubmitParams, reason: TOnSubmitReason) => void;

export type TOnSubmitCallbackId = (
  data: Pick<IOnSubmitParams, 'id'>,
  reason: TOnSubmitReason
) => void;
export interface IDataRowViewDetail {
  description?: string;
  duration: number;
  id: string;
}

export interface IDataSourceViewDetail {
  data: IDetailLoggedTime[] | undefined;
  datePicker?: Dayjs;
  selectedTask?: Partial<TasksOption>;
}

export interface IDataViewDetail {
  dataSource: IDataSourceViewDetail | undefined | null;
  setDataSource: React.Dispatch<React.SetStateAction<IDataSourceViewDetail | null | undefined>>;
  setOpenLogTimeModal: React.Dispatch<SetStateAction<boolean | Partial<IDataLogTimeProps>>>;
  onSubmitCallback?: TOnSubmitCallbackId;
}
