import request from '../axios';
import {
  getLinkDownloadFile,
  getTemplateValidationByType,
  getTimelogTemplateValidation,
} from './index';

jest.mock('@esp/constants/config', () => ({
  common: {
    useMockData: true,
  },
}));

const mockDataResponse = {
  data: 'https://105espstorageaccountdev.blob.core.windows.net/time-management/09_12_September_Export_d5237309-6913-453b-b4f6-e5dd742433a6.csv?sv=2023-01-03&se=2023-09-14T06%3A59%3A25Z&sr=b&sp=r&sig=5BUXajlHZpqmLAbyNYPkVFLMeTMUezSGZHl%2Bhj4HqHw%3D',
};

describe('File Management Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getLinkDownloadFile should return correctly value', async () => {
    jest.spyOn(request, 'get').mockResolvedValue(mockDataResponse);

    const response = await getLinkDownloadFile(
      '09_12_September_Export_d5237309-6913-453b-b4f6-e5dd742433a6'
    );

    expect(response).toEqual(mockDataResponse);
    expect(request.get).toHaveBeenCalledTimes(1);
  });

  it('getLinkDownloadFile should return error', async () => {
    jest.mock('@esp/constants/config', () => ({
      common: {
        useMockData: true,
      },
    }));

    let response;

    try {
      const error = new Error('error');
      jest.spyOn(request, 'get').mockRejectedValue(error);

      response = await getLinkDownloadFile(
        '09_12_September_Export_d5237309-6913-453b-b4f6-e5dd742433a6'
      );
    } catch (error) {
      expect(response).toBe(undefined);
      expect(request.get).toHaveBeenCalledTimes(1);
    }
  });

  it('getTemplateValidationByType should return correctly value', async () => {
    const mockDataResponse = {
      data: [
        {
          type: 'Import Time Log',
          header: 'Employee Email*',
          regexValidation: '\\w+@strongtie.com',
          position: 0,
          deletionTime: null,
          isDeleted: false,
          deleterUserId: null,
          lastModificationTime: '2023-10-18T07:35:37.5971495+00:00',
          lastModifierUserId: '00000000-0000-0000-0000-000000000000',
          creationTime: '2023-10-18T07:35:37.5971495+00:00',
          creatorUserId: '00000000-0000-0000-0000-000000000000',
          id: 'c03ba7ad-70fb-445f-8646-fa49385f186e',
        },
      ],
      timeStamp: '2023-10-19T03:42:48.3638344+00:00',
      status: 200,
      errors: null,
      path: '/api/file-management/v1/template-validation/type/import-time-log',
    };

    jest.spyOn(request, 'get').mockResolvedValue(mockDataResponse);

    const response = await getTemplateValidationByType('import-time-log');

    expect(response).toEqual(mockDataResponse);
    expect(request.get).toHaveBeenCalledTimes(1);
  });

  it('getTemplateValidationByType should return error', async () => {
    jest.mock('@esp/constants/config', () => ({
      common: {
        useMockData: true,
      },
    }));

    let response;

    try {
      const error = new Error('error');
      jest.spyOn(request, 'get').mockRejectedValue(error);

      response = await getTemplateValidationByType('import-time-log');
    } catch (error) {
      expect(response).toBe(undefined);
      expect(request.get).toHaveBeenCalledTimes(1);
    }
  });

  it('getTimelogTemplateValidation should return correctly value', async () => {
    const mockDataResponse = {
      data: [
        {
          type: 'Import Time Log',
          header: 'Employee Email*',
          regexValidation: '\\w+@strongtie.com',
          position: 0,
          deletionTime: null,
          isDeleted: false,
          deleterUserId: null,
          lastModificationTime: '2023-10-18T07:35:37.5971495+00:00',
          lastModifierUserId: '00000000-0000-0000-0000-000000000000',
          creationTime: '2023-10-18T07:35:37.5971495+00:00',
          creatorUserId: '00000000-0000-0000-0000-000000000000',
          id: 'c03ba7ad-70fb-445f-8646-fa49385f186e',
        },
      ],
      timeStamp: '2023-10-19T03:42:48.3638344+00:00',
      status: 200,
      errors: null,
      path: '/api/file-management/v1/template-validation/type/import-time-log',
    };

    jest.spyOn(request, 'get').mockResolvedValue(mockDataResponse);

    const response = await getTimelogTemplateValidation();

    expect(response).toEqual(mockDataResponse);
    expect(request.get).toHaveBeenCalledTimes(1);
  });

  it('getTimelogTemplateValidation should return error', async () => {
    jest.mock('@esp/constants/config', () => ({
      common: {
        useMockData: true,
      },
    }));

    let response;

    try {
      const error = new Error('error');
      jest.spyOn(request, 'get').mockRejectedValue(error);

      response = await getTimelogTemplateValidation();
    } catch (error) {
      expect(response).toBe(undefined);
      expect(request.get).toHaveBeenCalledTimes(1);
    }
  });
});
