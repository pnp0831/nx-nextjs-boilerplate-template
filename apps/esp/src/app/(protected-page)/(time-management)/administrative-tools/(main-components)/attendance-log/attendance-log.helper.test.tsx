import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockGetProgressInformationData } from '@esp/__mocks__/data-mock';
import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import dayjs from 'dayjs';

import {
  DATE_FORMAT,
  formatEndDate,
  formatStartDate,
  useGetAttendanceLogs,
  useGetTimesheetALogs,
} from './attendance-log.helper';

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});

describe('useGetAttendanceLogs', () => {
  it('should fetch and format data correctly', async () => {
    // Mock the useQuery hook
    (useQuery as jest.Mock).mockReturnValue(mockGetProgressInformationData);

    const { result } = renderHook(
      () =>
        useGetAttendanceLogs({
          tableName: 'test',
          loadOptions: {},
        }),
      {
        wrapper: ContextNeededWrapper,
      }
    );

    const { data } = result.current;

    expect(data).not.toBeNull();
  });

  it('should fetch and format data correctly with forceInitCall', async () => {
    const { result } = renderHook(
      () =>
        useGetAttendanceLogs({
          tableName: 'test',
          forceInitCall: true,
          loadOptions: {},
        }),
      {
        wrapper: ContextNeededWrapper,
      }
    );

    const { data } = result.current;

    expect(data).not.toBeNull();
  });

  it('should fetch and format data correctly with forceInitCall', async () => {
    // Mock the useQuery hook
    (useQuery as jest.Mock).mockReturnValue(mockGetProgressInformationData);

    const { result } = renderHook(
      () =>
        useGetAttendanceLogs({
          tableName: 'test',
          forceInitCall: false,
          loadOptions: {
            employeeIds: [],
            startDate: '',
            endDate: '',
          },
        }),
      {
        wrapper: ContextNeededWrapper,
      }
    );

    const { data } = result.current;

    expect(data).not.toBeNull();
  });
});

describe('useGetTimesheetALogs', () => {
  it('handle empty array', async () => {
    (useQuery as jest.Mock).mockReturnValue({ data: { data: { data: [] } } });
    const { result } = renderHook(() => useGetTimesheetALogs({}), {
      wrapper: ContextNeededWrapper,
    });

    const timesheetALogs = result.current.timesheetALogs;
    expect(timesheetALogs).toEqual({});
  });

  it('should fetch and format data correctly', async () => {
    const attendanceMockData = mockGetProgressInformationData.data.data[0];
    const expectedValue: Record<string, Record<string, string>> = {};
    expectedValue[dayjs(attendanceMockData.firstCheckIn).format(DATE_FORMAT)] = {
      start: dayjs(attendanceMockData.firstCheckIn).format('HH:mm'),
      end: dayjs(attendanceMockData.lastCheckOut).format('HH:mm'),
      remark: 'Testing user 12',
    };
    (useQuery as jest.Mock).mockReturnValue({ data: mockGetProgressInformationData });
    const { result } = renderHook(() => useGetTimesheetALogs({}), {
      wrapper: ContextNeededWrapper,
    });

    const timesheetALogs = result.current.timesheetALogs;
    expect(timesheetALogs).toEqual(expectedValue);
  });
});

describe('Common functions in helper', () => {
  it('should return correct data formatStartDate', () => {
    const startDate = dayjs(); // Replace with your desired date
    const formattedDate = formatStartDate(startDate);

    expect(formattedDate).toBe(startDate.startOf('d').toISOString());
  });

  it('should return correct data formatEndDate', () => {
    const endDate = dayjs(); // Replace with your desired date
    const formattedDate = formatEndDate(endDate);

    expect(formattedDate).toBe(endDate.endOf('d').toISOString());
  });
});
