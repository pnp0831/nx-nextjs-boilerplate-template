export const PROGRESS_PATH = {
  progessInformation: 'progress-management/v1/progress-information',
};
import request from '../axios';
import { IBaseAPIResponse } from '../types';

export type TProgresssStatus = 'Success' | 'Error' | 'In Progress';

export interface IDataProgressInformation {
  fileName: string;
  fileExtension: string;
  finishedTime: string;
  status: TProgresssStatus;
  requestedTime: string;
  result?: string;
  type: string;
  id: string;
}

export interface IExportProgressItems extends IDataProgressInformation {
  executionTime?: string;
  groupId?: string;
  deletionTime?: string;
  isDeleted?: boolean;
  deleterUserId?: string;
  lastModificationTime?: string;
  lastModifierUserId?: string;
  creationTime?: string;
  creatorUserId?: string;
  fileNamesForDownload?: string[];
}

export interface TResponseProgressInformation {
  data: IDataProgressInformation[];
  path?: string;
  totalCount?: number;
  groupCount?: number;
}

export type TResponseGetProgressInformation = IBaseAPIResponse<TResponseProgressInformation>;

export const getProgressInformation = (
  params?: string
): Promise<TResponseGetProgressInformation> => {
  return request.get(`${PROGRESS_PATH.progessInformation}?${params}`);
};

export interface TResponseProgressInformationWithParams {
  data: IDataProgressInformation;
  path?: string;
}

export const getProgressInformationById = (
  params: string | null
): Promise<TResponseProgressInformationWithParams> => {
  return request.get(`${PROGRESS_PATH.progessInformation}/${params}`);
};
