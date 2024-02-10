import { mockDataGetTimeLogs } from '@esp/__mocks__/data-mock';
import { DEFAULT_TIME_POLICIES } from '@esp/constants';

import request from '../axios';
import {
  deleteUserTimeLog,
  exportAttendanceLogs,
  getAttendanceLogs,
  getLatestSyncTimeLog,
  getTimeLogs,
  getTimePolicies,
  postTimeLogExport,
  putTimePolicies,
  putUserTimeLog,
  registerImportTimeLog,
} from '.';

const mockData = {
  employeeId: ['56afe61c-f0c0-de77-e3fa-c6083a4a6925', '56afe61c-f0c0-de77-e3fa-c6083a4a6925'],
  remark: ['Testing user 12', 'Testing user 12'],
  startDate: '2023-09-01T00:49:00',
  enđate: '2023-09-01T09:49:00',
};

const mockEmployeeId = '6692ff93-d249-46e6-ba7b-6a87602a22e3';

describe('Time Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate exportAttendanceLogs successfully', async () => {
    jest.spyOn(request, 'post').mockResolvedValue(mockData);

    const response = await exportAttendanceLogs(mockData, '1');

    expect(response).toEqual(mockData);
  });

  it('should generate getTimePolicies successfully', async () => {
    jest.spyOn(request, 'get').mockResolvedValue(DEFAULT_TIME_POLICIES);

    const response = await getTimePolicies('', '');

    expect(response).toEqual(DEFAULT_TIME_POLICIES);
  });

  it('should get DEFAULT_TIME_POLICIES when API failed', async () => {
    let response;
    try {
      const error = new Error('error');
      jest.spyOn(request, 'get').mockRejectedValue(error);

      response = await getTimePolicies('', '');
    } catch (error) {
      expect(response).toEqual(DEFAULT_TIME_POLICIES);
    }
  });

  it('should generate exportAttendanceLogs successfully', async () => {
    const params = 'test';

    jest.spyOn(request, 'get').mockResolvedValue(mockData);

    const response = await getAttendanceLogs(params);

    expect(response).toEqual(mockData);
  });

  it('should generate registerImportTimeLog successfully', async () => {
    jest.spyOn(request, 'post').mockResolvedValue({ message: 'success' });

    const response = await registerImportTimeLog('uuid');

    expect(response).toEqual({ message: 'success' });
  });

  it('should generate getTimeLogs successfully', async () => {
    jest.spyOn(request, 'get').mockResolvedValue({ data: mockDataGetTimeLogs });

    const params = '';

    const response = await getTimeLogs(params);

    expect(response).toEqual({ data: mockDataGetTimeLogs });
  });
  it('should generate putTimePolicies successfully', async () => {
    jest.spyOn(request, 'put').mockResolvedValue({ data: true });

    const response = await putTimePolicies({
      allowedEarlyOut: 4,
      allowedLateIn: 5,
      branchId: 'f5b164d7-2c71-44fc-9d8a-20b7cb14c907',
      maximumDurationPerLog: 720,
      minimumDurationPerLog: 11,
      organizationId: '1d4be9eb-cb40-4d30-aeae-ab993acffea5',
      statementDate: 5,
    });

    expect(response).toEqual({ data: true });
  });

  it('should generate postTimeLogExport successfully', async () => {
    jest.spyOn(request, 'post').mockResolvedValue({ data: 'uuid' });

    const response = await postTimeLogExport({
      employeeIds: ['23d4deae-0eb5-4a2d-f3f8-46230fb80be1'],
      endDate: '2023-12-05T20:00:00+07:00',
      startDate: '2023-12-05T08:00:00+07:00',
    });

    expect(response).toEqual({ data: 'uuid' });
  });

  it('should generate putUserTimeLog successfully', async () => {
    const mockData = {
      employeeId: '6692ff93-d249-46e6-ba7b-6a87602a22e3',
      taskId: '6d8a4e63-8d7d-4c62-1b0c-08dbd9f11a3b',
      startDate: '2023-12-19T08:00:00+07:00',
      endDate: '2023-12-19T10:00:00+07:00',
      description: 'Log 08h',
      id: 'f2358f9a-7509-4152-dcf6-08dbff9ad905',
    };
    jest.spyOn(request, 'put').mockResolvedValue({ data: mockData });

    const response = await putUserTimeLog(
      mockData,
      '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
      '56afe61c-f0c0-de77-e3fa-c6083a4a6925'
    );

    expect(response).toEqual({ data: mockData });
  });

  it('should generate deleteUserTimeLog successfully', async () => {
    const mockDataResponse = {
      data: true,
    };
    jest.spyOn(request, 'delete').mockResolvedValue({ data: mockDataResponse });

    const response = await deleteUserTimeLog('23d4deae-0eb5-4a2d-f3f8-46230fb80be1', 'a', 'b');

    expect(response).toEqual({ data: mockDataResponse });
  });

  it('should generate getLatestSyncTimeLog successfully', async () => {
    jest.spyOn(request, 'get').mockResolvedValue(null);

    const response = await getLatestSyncTimeLog(mockEmployeeId);

    expect(response).toEqual(null);
  });
});
