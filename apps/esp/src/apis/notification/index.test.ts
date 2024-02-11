import request from '../axios';
import {
  getNotification,
  getNotificationHubUrl,
  getNotificationUnmark,
  markNotifcation,
} from './index';

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getNotificationHubUrl should return correctly value', async () => {
    const mockResponseValue =
      'http://esp-backend-dev.southeastasia.cloudapp.azure.com/api/notification/hub?userId=user123';

    const response = await getNotificationHubUrl(
      'http://esp-backend-dev.southeastasia.cloudapp.azure.com',
      'user123'
    );

    expect(response).toEqual(mockResponseValue);
  });

  it('getNotification should return correctly value', async () => {
    const mockResponseValue = [
      {
        id: '7ba5ed53-9fe9-4ecf-a149-56f61a7bbdb4',
        message:
          'Upload 09_13_September_Export_fe27c25c-ac50-4b38-941f-27e304102031.csv is succeed',
        isSuccess: true,
        isMarked: true,
        type: 'Attendance Log Export',
        creationTime: '2023-09-13T04:08:41.6911813+00:00',
      },
    ];

    jest.spyOn(request, 'get').mockResolvedValue(mockResponseValue);

    const response = await getNotification({
      skip: 0,
      take: 1,
      userId: '51bcd0e2-a712-463c-881f-7415e7ee3e4f',
    });

    expect(response).toEqual(mockResponseValue);
    expect(request.get).toHaveBeenCalledTimes(1);
  });
  it('getNotification should return correctly value with default skip and take', async () => {
    const mockResponseValue = [
      {
        id: '7ba5ed53-9fe9-4ecf-a149-56f61a7bbdb4',
        message:
          'Upload 09_13_September_Export_fe27c25c-ac50-4b38-941f-27e304102031.csv is succeed',
        isSuccess: true,
        isMarked: true,
        type: 'Attendance Log Export',
        creationTime: '2023-09-13T04:08:41.6911813+00:00',
      },
    ];

    jest.spyOn(request, 'get').mockResolvedValue(mockResponseValue);

    const response = await getNotification({
      userId: '51bcd0e2-a712-463c-881f-7415e7ee3e4f',
    });

    expect(response).toEqual(mockResponseValue);
    expect(request.get).toHaveBeenCalledTimes(1);
  });

  it('getNotificationUnmark should return correctly value', async () => {
    const mockResponseValue = [
      {
        id: '7ba5ed53-9fe9-4ecf-a149-56f61a7bbdb4',
        message:
          'Upload 09_13_September_Export_fe27c25c-ac50-4b38-941f-27e304102031.csv is succeed',
        isSuccess: true,
        isMarked: true,
        type: 'Attendance Log Export',
        creationTime: '2023-09-13T04:08:41.6911813+00:00',
      },
    ];

    jest.spyOn(request, 'get').mockResolvedValue(mockResponseValue);

    const response = await getNotificationUnmark('51bcd0e2-a712-463c-881f-7415e7ee3e4f');

    expect(response).toEqual(mockResponseValue);
    expect(request.get).toHaveBeenCalledTimes(1);
  });

  it('markNotifcation should return correctly value', async () => {
    const mockResponseValue = '"6254cf7b-6df0-4ffc-a237-25caa82b8ea7';

    jest.spyOn(request, 'patch').mockResolvedValue(mockResponseValue);

    const response = await markNotifcation('51bcd0e2-a712-463c-881f-7415e7ee3e4f');

    expect(response).toEqual(mockResponseValue);
    expect(request.patch).toHaveBeenCalledTimes(1);
  });
});
