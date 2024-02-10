import request from '../axios';
import { IBaseAPIResponse } from '../types';

export const TASK_MANAGEMENT_API_PATH = {
  userTasksList: 'task-management/v1/tasks/by-employeeId',
  postUserTasksList: 'time-management/v1/timelogs',
  getTaskByIds: 'task-management/v1/tasks/get-tasks-by-ids',
};

export interface IUserTaskList {
  taskName: string;
  id: string;
  taskCode: string;
  employeeId: string;
}

export interface IPostUserTimeLog {
  employeeId: string | undefined;
  taskId: string | number;
  startDate: string;
  endDate: string;
  description: string;
  id?: string;
}

export type IGetUserTasksList = IBaseAPIResponse<IUserTaskList[]>;

export const getUserTasksList = (employeedId: string): Promise<IGetUserTasksList> => {
  return request.get(`${TASK_MANAGEMENT_API_PATH.userTasksList}/${employeedId}`);
};

export const postUserTimeLog = (
  body: IPostUserTimeLog,
  employeedId: string,
  organizationId: string,
  branchId: string,
  userId: string
) => {
  return request.post(TASK_MANAGEMENT_API_PATH.postUserTasksList, body, {
    headers: {
      employeeId: employeedId,
      organizationId: organizationId,
      branchId: branchId,
      userId: userId,
    },
  });
};

export interface ITask {
  id: string;
  serviceTicketId: string;
  status: number;
  taskCode: string;
  taskName: string;
}

export type TResponseGetTasksByTaskIds = IBaseAPIResponse<ITask[]>;

export const getTasksByTaskIds = (params?: string): Promise<TResponseGetTasksByTaskIds> => {
  return request.get(`${TASK_MANAGEMENT_API_PATH.getTaskByIds}?${params}`);
};
