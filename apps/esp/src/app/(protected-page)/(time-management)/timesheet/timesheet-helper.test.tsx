import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockCommonUser, mockDataGetTimeLogs, mockDataTaskByIds } from '@esp/__mocks__/data-mock';
import request from '@esp/apis/axios';
import { MAXIMUM_TAKE_RECORD } from '@esp/constants';
import { act, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';

import {
  addDurationToDateTime,
  convertDayJsDurationToMinutes,
  convertNumberToDayjs,
  formatDateBasedOnStatementDate,
  formatDurationToHourAndMinutes,
  formatHours,
  formatToHoursAndMinutes,
  getStartDate,
  getWorkingDatesInMonth,
  minutesToHours,
  useDataSourceForTimesheet,
  useGetLatestSyncTimeLog,
  validateMaximumLogTimeBeforeSubmit,
  validateMinumumLogTimeBeforeSubmit,
} from './timesheet-helper';

jest.mock('@esp/hooks/useAuth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      signIn: jest.fn(),
      signOut: jest.fn(),
      user: mockCommonUser,
    })),
  };
});

describe('Timesheet helper', () => {
  it('formatToHoursAndMinutes should be correctly', () => {
    expect(formatToHoursAndMinutes(90)).toBe('01:30:00');
    expect(formatToHoursAndMinutes(45)).toBe('00:45:00');
    expect(formatToHoursAndMinutes(120)).toBe('02:00:00');
  });

  it('addDurationToDateTime should be correctly', () => {
    expect(addDurationToDateTime('5', '10', '5')).toBeTruthy();
  });

  it('getStartDate should be correctly', () => {
    expect(getStartDate('2023-11-09T12:30:00Z', 'Z')).toBe('2023-11-09T08:00:00Z');
  });

  it('minutesToHours should return correctly value', () => {
    expect(minutesToHours(120)).toBe(2);
    expect(minutesToHours(30)).toBe(0.5);
  });

  it('formatHours should return correctly value', () => {
    expect(formatHours(12)).toBe(12);
    expect(formatHours(12.121313)).toBe(12.12);
    expect(formatHours('12')).toBe(12);
  });

  it('getWorkingDatesInMonth should return correctly value', () => {
    expect(getWorkingDatesInMonth(dayjs('10/11/2023'))).toBe(22);
    expect(
      getWorkingDatesInMonth(dayjs('11/11/2023', { format: 'DD/MM/YYYY' }), ['09/11/2023'])
    ).toBe(21);
  });

  it('useDataSourceForTimesheet should return correctly value', () => {
    const { result } = renderHook(
      () =>
        useDataSourceForTimesheet({
          loadOptions: {
            take: MAXIMUM_TAKE_RECORD,
            skip: 0,
            requireTotalCount: true,
          },
          format: 'DD/MM/YYYY',
        }),
      {
        wrapper: ContextNeededWrapper,
      }
    );

    expect(result.current).not.toBeNull();
  });

  it('useDataSourceForTimesheet should return correctly value', async () => {
    jest
      .spyOn(request, 'get')
      .mockImplementationOnce(() => {
        return Promise.resolve({
          data: {
            data: mockDataGetTimeLogs,
          },
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          data: mockDataTaskByIds,
        });
      });

    await act(async () => {
      const { result, waitForNextUpdate } = await renderHook(
        () =>
          useDataSourceForTimesheet({
            loadOptions: {
              take: MAXIMUM_TAKE_RECORD,
              skip: 0,
              requireTotalCount: true,
              startDate: '2023-11-01T23:59:59+07:00',
              endDate: '2023-11-30T23:59:59+07:00',
              employeeIds: ['10d8a5fd-ae95-4b4a-aba5-2e2c73781c28'],
            },
            format: 'DD/MM/YYYY',
          }),
        {
          wrapper: ContextNeededWrapper,
        }
      );
      await waitForNextUpdate();
      await waitForNextUpdate();

      expect(result.current.dataSource.length).toBeGreaterThan(0);
    });
  });
});

describe('convertNumberToDayjs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should convert a number to a dayjs object', () => {
    const duration = 60;

    const result = convertNumberToDayjs(duration);

    expect(result).toBeDefined();
    expect(result.isValid()).toBe(true);
  });
});

describe('convertDayJsDurationToMinutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly convert Dayjs duration to minutes', () => {
    const mockDuration: any = {
      hour: jest.fn(() => 2),
      minute: jest.fn(() => 30),
    };

    const result = convertDayJsDurationToMinutes(mockDuration);

    expect(result).toBe(2 * 60 + 30);

    expect(mockDuration.hour).toHaveBeenCalled();
    expect(mockDuration.minute).toHaveBeenCalled();
  });
});

describe('formatDateBasedOnStatementDate', () => {
  it('should format date based on the statement date', () => {
    jest.mock('dayjs', () => () => ({
      format: jest.fn().mockReturnValue('12'),
    }));

    const statementDate = 25;
    const currentDate = dayjs();

    const formattedDate = formatDateBasedOnStatementDate(statementDate);

    const expected = `${currentDate.format('MM')}-${statementDate}-${currentDate.format('YYYY')}`;

    expect(formattedDate).toBe(expected);
  });
});

describe('formatDurationToHourAndMinutes', () => {
  it('formats duration to hours and minutes correctly', () => {
    const duration1 = 120;
    render(<div>{formatDurationToHourAndMinutes(duration1)}</div>);
    expect(screen.getByText('02 hours and 00 minutes')).toBeInTheDocument();

    const duration2 = 75;
    render(<div>{formatDurationToHourAndMinutes(duration2)}</div>);
    expect(screen.getByText('01 hours and 15 minutes')).toBeInTheDocument();
  });
});

describe('validateMaximumLogTimeBeforeSubmit', () => {
  it('validateMaximumLogTimeBeforeSubmit should be render correctly', () => {
    const formattedTime = {
      duration: dayjs().startOf('day').add(7, 'hour'),
    };

    const formattedMaximumTime = formatToHoursAndMinutes(5);
    expect(validateMaximumLogTimeBeforeSubmit(formattedTime, formattedMaximumTime)).toBe(true);
  });

  it('should return false if maximumLogTime undefined', () => {
    const formattedTime = {
      duration: dayjs().startOf('day').add(7, 'hour'),
    };

    const formattedMaximumTime = undefined;
    expect(validateMaximumLogTimeBeforeSubmit(formattedTime, formattedMaximumTime)).toBe(false);
  });
});

describe('validateMinumumLogTimeBeforeSubmit', () => {
  it('validateMinumumLogTimeBeforeSubmit should be render correctly', () => {
    const formattedTime = {
      duration: dayjs().startOf('day'),
    };
    const formattedMinimumTime = formatToHoursAndMinutes(1);
    expect(validateMinumumLogTimeBeforeSubmit(formattedTime, formattedMinimumTime)).toBe(false);
  });

  it('should return false if minimumLogTime undefined', () => {
    const formattedTime = {
      duration: dayjs().startOf('day').add(7, 'hour'),
    };

    const formattedMinimumTime = undefined;
    expect(validateMinumumLogTimeBeforeSubmit(formattedTime, formattedMinimumTime)).toBe(false);
  });

  it('useGetLatestSyncTimeLog should return correctly value', () => {
    const { result } = renderHook(() => useGetLatestSyncTimeLog(), {
      wrapper: ContextNeededWrapper,
    });

    expect(result.current).not.toBeNull();
  });
});
