import { DEFAULT_SKIP, DEFAULT_TAKE } from '@esp/constants';
import { IMessagesType } from '@esp/libs/microsoft-signalR';

import request from '../axios';
import { IBaseAPIResponse } from '../types';

export const NOTIFICATION_API_PATH = {
  getNotifications: '/notification/v1/notification',
  getNotificationsUnmark: '/notification/v1/notification/unmark',
  markNofitication: '/notification/v1/notification/mark',
  notificationHub: 'api/notification/hub',
};

export interface IDataNotification {
  id: string;
  message: string;
  isSuccess: boolean;
  isMarked: boolean;
  type: IMessagesType;
  creationTime: string;
  downloadAttachmentUrl?: string;
}

export type IResponseGetNotification = IBaseAPIResponse<IDataNotification[]>;

export const getNotification = ({
  skip = DEFAULT_SKIP,
  take = DEFAULT_TAKE,
  userId,
}: {
  skip?: number;
  take?: number;
  userId: string;
}): Promise<IResponseGetNotification> => {
  return request.get(
    `${NOTIFICATION_API_PATH.getNotifications}?skip=${skip}&take=${take}&userId=${userId}`
  );
};

export type IResponseGetNotificationUnmark = IBaseAPIResponse<number>;

export const getNotificationUnmark = (userId: string): Promise<IResponseGetNotificationUnmark> => {
  return request.get(`${NOTIFICATION_API_PATH.getNotificationsUnmark}/${userId}`);
};

export const markNotifcation = (notiId: string) => {
  return request.patch(`${NOTIFICATION_API_PATH.markNofitication}/${notiId}`);
};

export const getNotificationHubUrl = (serverUrl: string, userId: string): string => {
  return `${serverUrl}/${NOTIFICATION_API_PATH.notificationHub}?userId=${userId}`;
};
