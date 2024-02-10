import request from '../axios';
import { getUnitsByEmployeeId } from './index';

describe('Resource Management Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getUnitsByEmployeeId should return correctly value', async () => {
    const mockDataResponse = {
      data: [
        {
          unitName: 'ESP QA team',
          unitId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
          manager: {
            managerName: 'User 4 ',
            managerId: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
          },
          employees: [
            {
              userName: 'User 4 ',
              employeeId: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
            },
          ],
          childs: [],
        },
      ],

      totalCount: 1,
      groupCount: -1,
      summary: null,
    };

    jest.spyOn(request, 'get').mockResolvedValue(mockDataResponse);

    const response = await getUnitsByEmployeeId('56afe61c-f0c0-de77-e3fa-c6083a4a6925');

    expect(response).toEqual(mockDataResponse);

    expect(request.get).toHaveBeenCalledTimes(1);
  });
});
