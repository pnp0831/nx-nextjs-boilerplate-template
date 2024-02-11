import { TResponseProgressInformation } from '@esp/apis/progress-management';
import { ILoadOptions } from '@ui-kit/components/table/type';

export interface IUseGetProgressInformation {
  exportTableName: string;
  loadOptions: ILoadOptions & { [key: string]: unknown };
  forceInitCall?: boolean;
  transformData?: (data: TResponseProgressInformation | undefined) => TResponseProgressInformation;
}
