export interface IBaseAPIResponse<T> {
  data: T;
  errors?: IError[];
  path?: string;
  status?: number;
  timeStamp?: string;
}

export interface IMessageInfo {
  statusCode: number;
  message: string;
}

export interface IError {
  errorCode: string | number;
  message: string;
  detail: string;
}
