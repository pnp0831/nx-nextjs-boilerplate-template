import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import { IFormDataInLocalStorage } from '@esp/contexts/import-export-notifier-context';
import { IRHFInput } from '@esp/utils/rhf-validation';
import { Dayjs } from 'dayjs';
import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormReset,
  UseFormSetError,
  UseFormStateReturn,
} from 'react-hook-form';

export interface ExportLogTimeProps {
  open: boolean;
  onClose: (isRemove?: boolean, fileName?: string) => void;
  onSuccess: (progressId: string, progressIds: string[], fileName: string) => void;
  className?: string;
  onError: () => void;
  hideBackdrop?: boolean;
  title: string;
  id: string;
  isModalInProgress?: boolean;
  formData?: IFormDataInLocalStorage;
}

export interface PeriodProps {
  current_month: boolean;
  last_month: boolean;
  last_three_months: boolean;
  last_six_months: boolean;
  last_twelve_months: boolean;
  current_year: boolean;
}

export interface ExportLogTimeFormData extends PeriodProps {
  units: IOrganizationUnitOptions[];
  startPeriod: Dayjs;
  endPeriod: Dayjs;
}
export type PeriodOptionData = {
  [key: string]: {
    startDate: Dayjs;
    endDate: Dayjs;
    name: string;
    label: string;
    checked: boolean;
  };
};

export interface IOption<T extends FieldValues> extends IRHFInput<T> {
  label: string;
  checked: boolean;
}

export interface IExportTimeLogPendingModal {
  onClose: () => void;
}
export interface IExportTimeLogDetailModal {
  resetModal: UseFormReset<ExportLogTimeFormData>;
  onCloseModal: (isRemove?: boolean, fileName?: string) => void;
  control: Control<ExportLogTimeFormData, any>;
  isSubmitting: boolean;
  handleOrgUnitsChange: (params: IOrganizationUnitOptions[]) => void;
  handleCheckbox: (name: string) => void;
  getValues: UseFormGetValues<ExportLogTimeFormData>;
  setError: UseFormSetError<ExportLogTimeFormData>;
  clearErrors: UseFormClearErrors<ExportLogTimeFormData>;
}

export interface ICustomControllerProps
  extends Pick<IExportTimeLogDetailModal, 'control' | 'getValues' | 'setError' | 'clearErrors'> {
  name: 'startPeriod' | 'endPeriod';
  render: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<ExportLogTimeFormData, 'startPeriod' | 'endPeriod'>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<ExportLogTimeFormData>;
  }) => React.ReactElement;
}
