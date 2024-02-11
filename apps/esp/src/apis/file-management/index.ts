import { AxiosRequestConfig } from 'axios';
import { UrlObject } from 'url';

import request from '../axios';
import { IBaseAPIResponse } from '../types';

declare type Url = string | UrlObject;

export const FILE_PATH = {
  downloadFile: 'file-management/v1/file/download-attachment',
  uploadAttachment: 'file-management/v1/file/upload-attachment',
  templateValidation: 'file-management/v1/template-validation/type',
};

export const TIME_MANAGEMENT = 'time-management';

export type TResponseGetLinkDownload = IBaseAPIResponse<Url>;

export const getLinkDownloadFile = (fileName?: string): Promise<TResponseGetLinkDownload> => {
  return request.get(`${FILE_PATH.downloadFile}/${TIME_MANAGEMENT}/${fileName}`);
};

export interface IUploadAttachment {
  id: string;
  name: string;
  extension: string;
  description: string;
  uploadBy: string;
  sizeInMB: number;
  virtualPath: string;
  created: string;
}

export type TResponseUploadAttachment = IBaseAPIResponse<IUploadAttachment[]>;

export const uploadAttachment = (
  file: File,
  config?: AxiosRequestConfig
): Promise<TResponseUploadAttachment> => {
  const formData = new FormData();

  formData.append('File', file);

  return request.post(FILE_PATH.uploadAttachment, formData, config);
};

export interface ITemplateValidation {
  type: string;
  header: string;
  regexValidation: string;
  position: number;
  id: string;
}

export type TResponsegetTemplateValidationByType = IBaseAPIResponse<ITemplateValidation[]>;
export type TResponseGetTimelogTemplateValidation = IBaseAPIResponse<ITemplateValidation[]>;

type TemplateValidationType = 'import-time-log';

export const getTemplateValidationByType = (
  type: TemplateValidationType
): Promise<TResponsegetTemplateValidationByType> => {
  return request.get(`${FILE_PATH.templateValidation}/${type}`);
};

export const getTimelogTemplateValidation = (): Promise<TResponseGetTimelogTemplateValidation> => {
  return request.get(`${FILE_PATH.templateValidation}/import-time-log`);
};
