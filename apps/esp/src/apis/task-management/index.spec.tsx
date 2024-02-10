import { mockDataTaskByIds } from '@esp/__mocks__/data-mock';
import { stringifyLoadOptions } from '@esp/utils/helper';

import request from '../axios';
import { getTasksByTaskIds, getUserTasksList, postUserTimeLog } from '.';

const mockData = {
  employeeId: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
  taskName: 'test-1',
  taskCode: 'demo-test',
  taskId: '1234',
};

const mockPostBody = {
  employeeId: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
  taskId: '1234',
  endDate: '2023-09-08T06:10:52.8583096+00:00',
  startDate: '2023-09-08T06:11:10.7302425+00:00',
  description: 'test body',
};

describe('Time Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate exportAttendanceLogs successfully', async () => {
    jest.spyOn(request, 'get').mockResolvedValue(mockData);

    const response = await getUserTasksList('56afe61c-f0c0-de77-e3fa-c6083a4a6925');

    expect(response).toEqual(mockData);
  });

  it('should generate exportAttendanceLogs successfully', async () => {
    jest.spyOn(request, 'post').mockResolvedValue(mockPostBody);

    const response = await postUserTimeLog(
      mockPostBody,
      '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
      '56afe61c-f0c0-de77-e3fa-c6083a4a6934',
      '56afe61c-f0c0-de77-e3fa-c6083a4a6912'
    );

    expect(response).toEqual(mockPostBody);
  });

  it('should generate getTasksByTaskIds successfully', async () => {
    jest.spyOn(request, 'get').mockResolvedValue({ data: mockDataTaskByIds });

    const params = stringifyLoadOptions({ ids: ['123'] });

    const response = await getTasksByTaskIds(params);

    expect(response).toEqual({ data: mockDataTaskByIds });
  });
});
