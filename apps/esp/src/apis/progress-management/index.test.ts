import request from '../axios';
import { getProgressInformation, getProgressInformationById } from './index';

jest.mock('@esp/constants/config', () => ({
  common: {
    useMockData: true,
  },
}));

describe('Progress Management Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProgressInformation should return correctly value', async () => {
    const mockDataResponse = {
      data: [
        {
          fileName: '09_08_September_Export_aa252c69-8799-4c9a-b8c2-1ef770008913',
          fileExtension: 'csv',
          status: 'Success',
          requestedTime: '2023-09-08T06:10:52.8583096+00:00',
          finishedTime: '2023-09-08T06:11:10.7302425+00:00',
          result: null,
          type: 'Attendance Log Export',
          deletionTime: null,
          isDeleted: false,
          deleterUserId: null,
          lastModificationTime: '2023-09-08T06:12:35.537973+00:00',
          lastModifierUserId: '51bcd0e2-a712-463c-881f-7415e7ee3e4f',
          creationTime: '2023-09-08T06:10:52.8608696+00:00',
          creatorUserId: '51bcd0e2-a712-463c-881f-7415e7ee3e4f',
          id: '91eaee73-7a2f-4a5e-b112-02dca8eccdc9',
        },
      ],
      totalCount: 1,
      groupCount: -1,
      summary: null,
    };

    jest.spyOn(request, 'get').mockResolvedValue(mockDataResponse);

    const response = await getProgressInformation('');

    expect(response).toEqual(mockDataResponse);

    expect(request.get).toHaveBeenCalledTimes(1);
  });

  it('getProgressInformationById should return correctly value', async () => {
    const mockDataResponse = {
      fileName: '09_08_September_Export_aa252c69-8799-4c9a-b8c2-1ef770008913',
      fileExtension: 'csv',
      status: 'Success',
      requestedTime: '2023-09-08T06:10:52.8583096+00:00',
      finishedTime: '2023-09-08T06:11:10.7302425+00:00',
      result: null,
      type: 'Attendance Log Export',
      deletionTime: null,
      isDeleted: false,
      deleterUserId: null,
      lastModificationTime: '2023-09-08T06:12:35.537973+00:00',
      lastModifierUserId: '51bcd0e2-a712-463c-881f-7415e7ee3e4f',
      creationTime: '2023-09-08T06:10:52.8608696+00:00',
      creatorUserId: '51bcd0e2-a712-463c-881f-7415e7ee3e4f',
      id: '91eaee73-7a2f-4a5e-b112-02dca8eccdc9',
    };

    jest.spyOn(request, 'get').mockResolvedValue(mockDataResponse);

    const response = await getProgressInformationById('91eaee73-7a2f-4a5e-b112-02dca8eccdc9');

    expect(response).toEqual(mockDataResponse);

    expect(request.get).toHaveBeenCalledTimes(1);
  });
});
