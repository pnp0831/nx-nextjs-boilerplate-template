import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import {
  mockCommonUser,
  mockOptionUnitsData,
  mockTasksListData,
  mockTimePolicyData,
} from '@esp/__mocks__/data-mock';
import { useGetUnits } from '@esp/components/organizations-select/organizations-select.helper';
import { act, fireEvent, render } from '@testing-library/react';

import { useGetTimePolicies } from '../administrative-tools/(main-components)/time-policy/time-policy.helper';
import TimeManagement from './page';
import {
  formatDateBasedOnStatementDate,
  useGetLatestSyncTimeLog,
  useGetUserTasksList,
} from './timesheet-helper';

jest.mock('./timesheet-helper', () => ({
  useGetUserTasksList: jest.fn(),
  formatDateBasedOnStatementDate: jest.fn(),
  getTimeZone: jest.fn(),
  customizeLabelInput: jest.fn(),
  useDataSourceForTimesheet: jest.fn().mockReturnValue({
    taskInfo: {
      '2c08b4ed-4dce-4cf4-4018-08db94951482': {
        serviceTicketId: 'f2c30b1f-b084-4721-9a1a-c1629f605063',
        status: 0,
        id: '2c08b4ed-4dce-4cf4-4018-08db94951482',
        taskCode: 'T0094',
        taskName: 'Name 1',
      },
      'eb7e154c-0fb4-4524-1b0b-08dbd9f11a3b': {
        serviceTicketId: '7bf0c736-a5af-4ae0-961f-87486b0dfb96',
        status: 0,
        id: 'eb7e154c-0fb4-4524-1b0b-08dbd9f11a3b',
        taskCode: 'WEC-1120',
        taskName: '6-Need-Name',
      },
      '6d8a4e63-8d7d-4c62-1b0c-08dbd9f11a3b': {
        serviceTicketId: '7bf0c736-a5af-4ae0-961f-87486b0dfb96',
        status: 0,
        id: '6d8a4e63-8d7d-4c62-1b0c-08dbd9f11a3b',
        taskCode: 'WEC-1119',
        taskName: '7-Need-Name',
      },
      'a8600314-4d4f-4b0f-1b0d-08dbd9f11a3b': {
        serviceTicketId: '7bf0c736-a5af-4ae0-961f-87486b0dfb96',
        status: 0,
        id: 'a8600314-4d4f-4b0f-1b0d-08dbd9f11a3b',
        taskCode: 'WEC-1118',
        taskName: '8-Need-Name',
      },
      '193b5040-e5c8-5882-19dd-4d8b8838d897': {
        serviceTicketId: 'e641c426-5ec5-4315-a8d6-4e9db4a068d8',
        status: 0,
        id: '193b5040-e5c8-5882-19dd-4d8b8838d897',
        taskCode: 'WEC-1122',
        taskName: '11-Need-Name',
      },
      '07b92c37-a10e-ca61-edb5-72f692dcf9dc': {
        serviceTicketId: 'e7be3a09-f30a-15c7-4018-45c6171be918',
        status: 0,
        id: '07b92c37-a10e-ca61-edb5-72f692dcf9dc',
        taskCode: 'WEC-1124',
        taskName: '13-Need-Name',
      },
      '56afe61c-f0c0-de77-e3fa-c6083a4a6888': {
        serviceTicketId: 'e641c426-5ec5-4315-a8d6-4e9db4a068d8',
        status: 0,
        id: '56afe61c-f0c0-de77-e3fa-c6083a4a6888',
        taskCode: 'WEC-1126',
        taskName: '15-Need-Name',
      },
    },
    dataSource: [
      {
        taskId: 'eb7e154c-0fb4-4524-1b0b-08dbd9f11a3b',
        data: {
          '02/11/2023': {
            logged: 8,
          },
          '03/11/2023': {
            logged: 1,
          },
          '04/11/2023': {
            logged: 1,
          },
          '15/11/2023': {
            logged: 1,
          },
          '17/11/2023': {
            logged: 1.18,
          },
        },
        totalLogged: 12.18,
        overtimeLogged: 0,
      },
      {
        taskId: '6d8a4e63-8d7d-4c62-1b0c-08dbd9f11a3b',
        data: {
          '07/11/2023': {
            logged: 5,
          },
          '17/11/2023': {
            logged: 1,
          },
        },
        totalLogged: 6,
        overtimeLogged: 0,
      },
      {
        taskId: 'a8600314-4d4f-4b0f-1b0d-08dbd9f11a3b',
        data: {
          '05/11/2023': {
            logged: 6,
          },
          '08/11/2023': {
            logged: 11,
          },
        },
        totalLogged: 17,
        overtimeLogged: 0,
      },
      {
        taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
        data: {
          '15/11/2023': {
            logged: 6,
          },
          '16/11/2023': {
            logged: 1,
          },
          '03/11/2023': {
            logged: 10,
          },
        },
        totalLogged: 17,
        overtimeLogged: 0,
      },
      {
        taskId: '193b5040-e5c8-5882-19dd-4d8b8838d897',
        data: {
          '02/11/2023': {
            logged: 1,
          },
        },
        totalLogged: 1,
        overtimeLogged: 0,
      },
      {
        taskId: '07b92c37-a10e-ca61-edb5-72f692dcf9dc',
        data: {
          '16/11/2023': {
            logged: 1.25,
          },
        },
        totalLogged: 1.25,
        overtimeLogged: 0,
      },
      {
        taskId: '56afe61c-f0c0-de77-e3fa-c6083a4a6888',
        data: {
          '06/11/2023': {
            logged: 1,
          },
        },
        totalLogged: 1,
        overtimeLogged: 0,
      },
      {
        name: 'Subtotal',
        totalLogged: 55.43,
        data: {
          '02/11/2023': {
            logged: 1,
            overrtime: 0,
          },
          '03/11/2023': {
            logged: 10,
            overrtime: 0,
          },
          '04/11/2023': {
            logged: 1,
            overrtime: 0,
          },
          '15/11/2023': {
            logged: 6,
            overrtime: 0,
          },
          '17/11/2023': {
            logged: 1,
            overrtime: 0,
          },
          '07/11/2023': {
            logged: 5,
            overrtime: 0,
          },
          '05/11/2023': {
            logged: 6,
            overrtime: 0,
          },
          '08/11/2023': {
            logged: 11,
            overrtime: 0,
          },
          '16/11/2023': {
            logged: 1.25,
            overrtime: 0,
          },
          '06/11/2023': {
            logged: 1,
            overrtime: 0,
          },
        },
        taskId: '',
        isSubtotal: true,
      },
    ],
    loading: false,
  }),
  minutesToHours: jest.fn(),
  formatHours: jest.fn(),
  getWorkingDatesInMonth: jest.fn(),
  // isBeforeStatementDate: jest.fn(),
  useGetLatestSyncTimeLog: jest.fn(),
}));

jest.mock('../administrative-tools/(main-components)/time-policy/time-policy.helper', () => ({
  useGetTimePolicies: jest.fn(),
}));

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

jest.mock('@esp/components/organizations-select/organizations-select.helper', () => ({
  useGetUnits: jest.fn(),
  getEmployeeIds: jest.fn(),
}));

describe('Time Management', () => {
  (useGetTimePolicies as jest.Mock).mockReturnValue(mockTimePolicyData);
  (useGetUserTasksList as jest.Mock).mockReturnValue(mockTasksListData);
  (formatDateBasedOnStatementDate as jest.Mock).mockReturnValue(mockTimePolicyData.statementDate);
  (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });
  (useGetLatestSyncTimeLog as jest.Mock).mockReturnValue({
    data: { data: '2024-01-24T06:07:26.7809458+00:00' },
  });

  it('should render content successfully', () => {
    const { baseElement } = render(
      <ContextNeededWrapper>
        <TimeManagement />
      </ContextNeededWrapper>
    );

    expect(baseElement).not.toBeNull();
  });

  it('should open modal when clicking button Logtime', async () => {
    const { getByRole } = render(
      <ContextNeededWrapper>
        <TimeManagement />
      </ContextNeededWrapper>
    );
    const LogTimeButton = getByRole('button', { name: 'Log Time' });
    fireEvent.click(LogTimeButton);

    await act(async () => {
      fireEvent.click(LogTimeButton);
    });
  });

  it('should render timesheet successfully', () => {
    const { getByText, getByTestId } = render(
      <ContextNeededWrapper>
        <TimeManagement />
      </ContextNeededWrapper>
    );

    expect(getByText('Log Time')).toBeInTheDocument();

    fireEvent.click(getByText('Log Time'));

    expect(getByTestId('ArrowBackIosNewIcon')).toBeInTheDocument();

    fireEvent.click(getByTestId('ArrowBackIosNewIcon'));
  });
});
