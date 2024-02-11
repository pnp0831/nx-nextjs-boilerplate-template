import { IGetTimeLog } from '@esp/apis/time-management';
import { Option } from '@ui-kit/components/autocomplete';
import { Dayjs } from 'dayjs';

import { TOnSubmitCallback } from '../../type';

export interface IDataLogTimeProps {
  datePicker: Dayjs;
  duration: Dayjs;
  description?: string;
  selectedTask: Partial<TasksOption>;
  id: string;
}

export type IOnSubmitParams = IGetTimeLog;

export interface LogTimeModalProps {
  openLogTimeModal: boolean;
  setOpenLogTimeModal: (openLogTimeModal: boolean) => void;
  showCheckbox?: boolean;
  isCreating?: boolean;
  data?: IDataLogTimeProps;
  listOptions?: TasksOption[];
  onSubmitCallback?: TOnSubmitCallback;
  employeeId: string;
}

export interface TasksOption extends Option {
  value: string | number;
  taskCode: string;
  taskName: string;
  status?: number;
}
