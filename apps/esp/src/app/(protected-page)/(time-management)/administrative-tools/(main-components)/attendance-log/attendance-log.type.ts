import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import { Option } from '@ui-kit/components/autocomplete';
import { IExtendParams, ILoadOptions } from '@ui-kit/components/table/type';
import { Dayjs } from 'dayjs';

export interface IParamsOptions {
  employeeIds?: string[];
  startDate?: string;
  endDate?: string;
  remarks?: string[];
}

export interface IUseGetAttendanceLogs {
  tableName: string;
  loadOptions: ILoadOptions & IParamsOptions;
  forceInitCall?: boolean;
}

export interface IAttendanceLogActionProps {
  onLoadOptionsChange: (loadOptions: ILoadOptions, extendParams?: IExtendParams) => void;
  resetPageOptions: () => void;
  isFilterDataEmptied: boolean | undefined;
}

export interface AttendanceFilterFormData {
  period?: Dayjs[];
  remark?: Option[];
  units?: IOrganizationUnitOptions[];
}
