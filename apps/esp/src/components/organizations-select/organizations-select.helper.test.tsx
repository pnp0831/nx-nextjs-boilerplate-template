import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { getEmployeeIds, useGetUnits } from './organizations-select.helper';

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});

describe('getEmployeeIds', () => {
  it('getEmployeeIds should return correctly ', async () => {
    const units = [
      {
        isEmployee: true,
        label: 'User 4 ',
        value: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
        parentId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        parentName: 'ESP QA team',
      },
    ];

    const optionUnits = [
      {
        label: 'ESP QA team',
        value: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        isUnit: true,
      },
      {
        isEmployee: true,
        label: 'User 4 ',
        value: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
        parentId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        parentName: 'ESP QA team',
      },
    ];

    const expectResults = ['56afe61c-f0c0-de77-e3fa-c6083a4a6925'];

    expect(getEmployeeIds(units, optionUnits)).toEqual(expectResults);
  });

  it('getEmployeeIds should return correctly ', async () => {
    const units = [
      {
        label: 'ESP QA team',
        value: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        isUnit: true,
      },
    ];

    const optionUnits = [
      {
        label: 'ESP QA team',
        value: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        isUnit: true,
      },
      {
        isEmployee: true,
        label: 'User 4 ',
        value: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
        parentId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        parentName: 'ESP QA team',
      },
    ];

    const expectResults = ['56afe61c-f0c0-de77-e3fa-c6083a4a6925'];

    expect(getEmployeeIds(units, optionUnits)).toEqual(expectResults);
  });
});

describe('useGetUnits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and format data correctly', async () => {
    // Mock data for your test case
    const mockData = {
      data: {
        data: [
          {
            unitName: 'ESP QA team',
            unitId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
            manger: {
              managerName: 'User 4 ',
              managerId: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
            },
            employees: [
              {
                userName: 'User 4 ',
                employeeId: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
              },
            ],
            childs: [
              {
                unitName: 'ESP QA team 1',
                unitId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb1',
                employees: [
                  {
                    userName: 'User 4 1',
                    employeeId: '56afe61c-f0c0-de77-e3fa-c6083a4a69251',
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    // Mock the useQuery hook
    (useQuery as jest.Mock).mockReturnValue(mockData);

    const { result } = renderHook(() => useGetUnits(), {
      wrapper: ContextNeededWrapper,
    });

    const { optionUnits, employees } = result.current;

    const expectOtionUnits = [
      {
        level: 1,
        label: 'ESP QA team',
        value: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        isUnit: true,
        parentId: undefined,
        parentName: undefined,
        belongToUnitName: undefined,
      },
      {
        belongToUnitName: 'ESP QA team',
        level: 2,
        label: 'ESP QA team 1',
        value: '4748e97f-2bc2-c389-59ef-0ad92596cbfb1',
        parentId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        parentName: 'ESP QA team',
        isUnit: true,
      },
      {
        level: 1,
        label: 'User 4 ',
        value: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
        isEmployee: true,
        parentId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        parentName: 'ESP QA team',
        isManager: false,
        belongToUnitName: 'ESP QA team !!!',
        email: undefined,
      },
      {
        level: 2,
        label: 'User 4 1',
        value: '56afe61c-f0c0-de77-e3fa-c6083a4a69251',
        isEmployee: true,
        parentId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
        parentName: 'ESP QA team',
        isManager: false,
        belongToUnitName: 'ESP QA team 1 !!!',
        email: undefined,
      },
    ];

    const expectEmployees = {
      '56afe61c-f0c0-de77-e3fa-c6083a4a6925': {
        name: 'User 4 ',
        id: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
      },
      '56afe61c-f0c0-de77-e3fa-c6083a4a69251': {
        name: 'User 4 1',
        id: '56afe61c-f0c0-de77-e3fa-c6083a4a69251',
      },
    };

    expect(optionUnits).toEqual(expectOtionUnits);
    expect(employees).toEqual(expectEmployees);
  });

  it('should fetch and format data correctly without user', async () => {
    const { result } = renderHook(() => useGetUnits(), {
      wrapper: ContextNeededWrapper,
    });

    const { optionUnits } = result.current;

    expect(optionUnits).not.toBeNull();
  });
});
