import { ITemplateValidation } from '@esp/apis/file-management';
import { LOADING_STATUS } from '@esp/contexts/import-export-notifier-context';
import { ESPFile } from '@ui-kit/components/upload-input/type';
import { ReactNode } from 'react';

export interface IInitStateModal {
  fileName?: string;
  step?: IMPORT_STEP | null;
  helperText?: ReactNode | string | null;
  disableUploadBtn?: boolean;
}

export interface IImportModalProps {
  title: string;
  accept?: string;
  downloadTemplateUrl: string;
  onClose: (isRemove?: boolean, fileName?: string) => void;
  mockWorker?: Worker;
  open: boolean;
  onSuccess: (progressId: string, fileName: string) => void;
  closeAnimation?: string;
  onError: (isWarningFlow?: boolean) => void;
  onReceiveFileSize: (fileSize: number) => void;
  className?: string;
  hideBackdrop?: boolean;
  initState?: IInitStateModal;
  onResubmit: () => void;
  status?: LOADING_STATUS;
  isInterrupted?: boolean;
  onInterrupted?: (state: Partial<IInitStateModal>) => void;
  onUpdateState?: (state: Partial<IInitStateModal>) => void;
}

export type ICheckColumns = {
  name: string;
  type?: 'string' | 'number' | 'date';
  format?: string;
  required?: boolean;
  checkHeader?: boolean;
};

export interface IUploadProgressBoxProps {
  selectedFile: ESPFile | null;
  onSuccess: (fileId: string) => void;
  onError: (errorMessage: string, isCancelRequest?: boolean) => void;
  onUploadAttachmentSuccess: () => void;
  onReceiveFileSize: (fileSize: number) => void;
}

export interface IFileValidatingBoxProps {
  selectedFile: ESPFile | null;
  onError: (message: string | ReactNode) => void;
  onSuccess: () => void;
  workerThread: Worker;
  templateValidation: ITemplateValidation[];
}

export interface ICheckingInfo {
  [columnName: string]: {
    name: string;
    status: ColumnValidationStatus;
    isColumn?: boolean;
  };
}

export type ColumnValidationStatus = 'invalid' | 'valid' | 'unknown';

export enum IMPORT_STEP {
  CHECKING = 'Check',
  UPLOADING = 'Upload',
  COMPLETED = 'Complete',
}

export type ITimeLogTemplateValidation = ITemplateValidation;
