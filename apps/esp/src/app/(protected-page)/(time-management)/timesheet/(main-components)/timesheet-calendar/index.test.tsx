import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import {
  mockCommonUser,
  mockOptionUnitsData,
  mockTasksListData,
  mockTimePolicyData,
} from '@esp/__mocks__/data-mock';
import { deleteUserTimeLog } from '@esp/apis/time-management';
import { useGetTimePolicies } from '@esp/app/(protected-page)/(time-management)/administrative-tools/(main-components)/time-policy/time-policy.helper';
import { useGetUnits } from '@esp/components/organizations-select/organizations-select.helper';
import { act, fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'react-hook-form';

import {
  formatDateBasedOnStatementDate,
  useGetLatestSyncTimeLog,
  useGetUserTasksList,
} from '../../timesheet-helper';
import TimesheetAction from './components/timesheet-calendar.action';
import TimesheetCalendarError from './components/timesheet-calendar.error';
import ViewDetailLogTimeModal from './components/view-detail-log-time-modal';
import TimesheetCalendarWrapper from './index';

const mockFormValue = {
  startDate: '2023-11-01T16:59:59.999Z',
  endDate: '2023-11-30T16:59:59.999Z',
  units: {
    isEmployee: true,
    label: 'Phat Pham',
    value: '10d8a5fd-ae95-4b4a-aba5-2e2c73781c28',
    parentId: '5750233a-2d97-e7c3-f258-ee59a9cc84bd',
    parentName: 'Big QA team',
  },
};

const mockDataSourceViewDetail = {
  data: [
    {
      description: '',
      duration: 600,
      employeeId: '6692ff93-d249-46e6-ba7b-6a87602a22e3',
      endDate: '2023-12-19T11:00:00+00:00',
      startDate: '2023-12-23T01:00:00+00:00',
      taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
      id: '7501f202-458c-4ef0-dcce-08dbff9ad905',
    },
  ],
  selectedTask: {
    taskCode: 'T0094',
    taskName: 'Name 1',
    value: '2c08b4ed-4dce-4cf4-4018-08db94951482',
    status: 2,
  },
  datePicker: '2023-12-19T09:07:14.840Z',
};

const mockDataSourceViewDetailWithDes = {
  data: [
    {
      description: 'test data',
      duration: 300,
      employeeId: '6692ff93-d249-46e6-ba7b-6a87602a22e3',
      endDate: '2023-12-19T11:00:00+00:00',
      startDate: '2023-12-19T01:00:00+00:00',
      taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
      id: '7501f202-458c-4ef0-dcce-08dbff9ad905',
    },
  ],
  selectedTask: {
    taskCode: 'T0094',
    taskName: 'Name 1',
    value: '2c08b4ed-4dce-4cf4-4018-08db94951482',
    status: 2,
  },
  datePicker: '2023-12-19T09:07:14.840Z',
};

const mockEmptyDataSourceViewDetail = {
  data: [],
  selectedTask: {
    taskCode: 'T0094',
    taskName: 'Name 1',
    value: '2c08b4ed-4dce-4cf4-4018-08db94951482',
    status: 2,
  },
  datePicker: '2023-12-19T09:07:14.840Z',
};

const mockDeleteSuccess = {
  data: true,
  timeStamp: '2023-12-20T03:16:12.7349267+00:00',
  status: 200,
  errors: null,
  path: '/api/time-management/v1/timelogs/101bf8e1-3369-4bb3-dc86-08dbff9ad905',
};

jest.mock('../../../administrative-tools/(main-components)/time-policy/time-policy.helper', () => ({
  useGetTimePolicies: jest.fn(),
}));

jest.mock('@esp/components/organizations-select/organizations-select.helper', () => ({
  useGetUnits: jest.fn(),
  getEmployeeIds: jest.fn(),
}));

jest.mock('@esp/apis/time-management', () => ({
  deleteUserTimeLog: jest.fn(),
}));

jest.mock('../../timesheet-helper.tsx', () => ({
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
  useGetUserTasksList: jest.fn(),
  formatDateBasedOnStatementDate: jest.fn(),
  getTimeZone: jest.fn(),
  customizeLabelInput: jest.fn(),
  getWorkingDatesInMonth: jest.fn(),
  convertNumberToDayjs: jest.fn(),
  useGetLatestSyncTimeLog: jest.fn(),
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

describe('TimesheetCalendar Wrapper', () => {
  beforeAll(() => {
    (useGetTimePolicies as jest.Mock).mockReturnValue(mockTimePolicyData);
    (useGetUserTasksList as jest.Mock).mockReturnValue(mockTasksListData);
    (formatDateBasedOnStatementDate as jest.Mock).mockReturnValue(mockTimePolicyData.statementDate);
    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });
    (useGetLatestSyncTimeLog as jest.Mock).mockReturnValue({
      data: { data: '2024-01-24T06:07:26.7809458+00:00' },
    });
  });

  it('should render content successfully', () => {
    const onFilterTimesheet = jest.fn();

    const { getByText, getByTestId } = render(
      <TimesheetCalendarWrapper formValue={mockFormValue} onFilterTimesheet={onFilterTimesheet} />,
      { wrapper: ContextNeededWrapper }
    );

    expect(getByText('Phat Pham')).toBeInTheDocument();

    expect(getByTestId('ArrowBackIosNewIcon')).toBeInTheDocument();

    fireEvent.click(getByTestId('ArrowBackIosNewIcon'));

    expect(onFilterTimesheet).toHaveBeenCalled();

    expect(getByTestId('SettingsIcon')).toBeInTheDocument();

    fireEvent.click(getByTestId('SettingsIcon'));

    expect(getByText('Import Time Log')).toBeInTheDocument();

    fireEvent.click(getByText('Import Time Log'));
  });

  it('should render content successfully with some action', () => {
    const onFilterTimesheet = jest.fn();

    const { getByText, getByTestId } = render(
      <TimesheetCalendarWrapper formValue={mockFormValue} onFilterTimesheet={onFilterTimesheet} />,
      { wrapper: ContextNeededWrapper }
    );

    expect(getByTestId('SettingsIcon')).toBeInTheDocument();

    fireEvent.click(getByTestId('SettingsIcon'));

    expect(getByText('Export Time Log')).toBeInTheDocument();

    fireEvent.click(getByText('Export Time Log'));
  });
});

describe('TimesheetCalendar Action', () => {
  beforeAll(() => {
    (useGetTimePolicies as jest.Mock).mockReturnValue(mockTimePolicyData);
    (useGetUserTasksList as jest.Mock).mockReturnValue(mockTasksListData);
    (formatDateBasedOnStatementDate as jest.Mock).mockReturnValue(mockTimePolicyData.statementDate);
    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });
  });

  // it('should render content successfully', () => {
  //   const onFilterTimesheet = jest.fn();
  //   const setValue = jest.fn();
  //   const { result } = renderHook(() => useForm());
  //   const mockControl = result.current.control;

  //   const { getByText, getByRole } = render(
  //     <TimesheetAction
  //       units={{
  //         isEmployee: true,
  //         label: 'Phat Pham',
  //         value: '10d8a5fd-ae95-4b4a-aba5-2e2c73781c28',
  //         parentId: '5750233a-2d97-e7c3-f258-ee59a9cc84bd',
  //         parentName: 'Big QA team',
  //       }}
  //       onFilterTimesheet={onFilterTimesheet}
  //       setValue={setValue}
  //       control={mockControl}
  //     />,
  //     { wrapper: ContextNeededWrapper }
  //   );

  //   const list = getByRole('combobox');

  //   fireEvent.change(list, {
  //     target: {
  //       value: 'quang',
  //     },
  //   });

  //   const optionsElement = getByText(new RegExp('Quang Hoang A', 'i'));
  //   expect(optionsElement).toBeInTheDocument();
  //   fireEvent.click(optionsElement);

  //   expect(getByText('Apply')).toBeInTheDocument();
  //   fireEvent.click(getByText('Apply'));
  //   expect(onFilterTimesheet).toHaveBeenCalled();
  // });

  it('should render content no options', () => {
    const onFilterTimesheet = jest.fn();
    const setValue = jest.fn();
    const { result } = renderHook(() => useForm());
    const mockControl = result.current.control;

    const { getByAltText, getByRole } = render(
      <TimesheetAction
        units={{
          isEmployee: true,
          label: 'Phat Pham',
          value: '10d8a5fd-ae95-4b4a-aba5-2e2c73781c28',
          parentId: '5750233a-2d97-e7c3-f258-ee59a9cc84bd',
          parentName: 'Big QA team',
        }}
        onFilterTimesheet={onFilterTimesheet}
        setValue={setValue}
        control={mockControl}
      />,
      { wrapper: ContextNeededWrapper }
    );

    const list = getByRole('combobox');

    fireEvent.change(list, {
      target: {
        value: 'Phat Pham',
      },
    });

    const optionsElement = getByAltText(new RegExp('no-data', 'i'));
    expect(optionsElement).toBeInTheDocument();
  });
});

describe('TimesheetCalendar Behavior Edit View Detail Modal', () => {
  jest.useFakeTimers();

  beforeAll(() => {
    (useGetTimePolicies as jest.Mock).mockReturnValue(mockTimePolicyData);
    (useGetUserTasksList as jest.Mock).mockReturnValue(mockTasksListData);
    (formatDateBasedOnStatementDate as jest.Mock).mockReturnValue(mockTimePolicyData.statementDate);
    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });
  });

  it('should call setOpenLogTime when click edit', () => {
    const mockSetDataSource = jest.fn();
    const mockSetOpenLogTimeModal = jest.fn();

    const { getByTestId } = render(
      <ViewDetailLogTimeModal
        dataSource={mockDataSourceViewDetail}
        setOpenLogTimeModal={mockSetOpenLogTimeModal}
        setDataSource={mockSetDataSource}
      />,
      { wrapper: ContextNeededWrapper }
    );

    const editIcon = getByTestId('EditIcon');
    fireEvent.click(editIcon);

    expect(mockSetOpenLogTimeModal).toHaveBeenCalled();
  });
});

describe('TimesheetCalendar Behavior Delete View Detail Modal', () => {
  jest.useFakeTimers();

  beforeAll(() => {
    (useGetTimePolicies as jest.Mock).mockReturnValue(mockTimePolicyData);
    (useGetUserTasksList as jest.Mock).mockReturnValue(mockTasksListData);
    (formatDateBasedOnStatementDate as jest.Mock).mockReturnValue(mockTimePolicyData.statementDate);
    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });
    (deleteUserTimeLog as jest.Mock).mockReturnValue(mockDeleteSuccess);
  });

  it('should delete succesfully if button yes is clicked', async () => {
    const mockSetDataSource = jest.fn();
    const mockSetOpenLogTimeModal = jest.fn();
    const mockOnSubmitCallback = jest.fn();

    const { getByTestId, getByRole } = render(
      <ViewDetailLogTimeModal
        dataSource={mockDataSourceViewDetail}
        setOpenLogTimeModal={mockSetOpenLogTimeModal}
        setDataSource={mockSetDataSource}
        onSubmitCallback={mockOnSubmitCallback}
      />,
      { wrapper: ContextNeededWrapper }
    );

    const deleteIcon = getByTestId('DeleteForeverIcon');
    fireEvent.click(deleteIcon);

    const confirmButton = getByRole('button', { name: 'Yes' });
    expect(confirmButton).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(confirmButton);
    });
  });

  it('should not delete if button no is clicked', () => {
    const mockSetDataSource = jest.fn();
    const mockSetOpenLogTimeModal = jest.fn();
    const mockOnSubmitCallback = jest.fn();

    const { getByTestId, getByRole } = render(
      <ViewDetailLogTimeModal
        dataSource={mockDataSourceViewDetail}
        setOpenLogTimeModal={mockSetOpenLogTimeModal}
        setDataSource={mockSetDataSource}
        onSubmitCallback={mockOnSubmitCallback}
      />,
      { wrapper: ContextNeededWrapper }
    );

    const deleteIcon = getByTestId('DeleteForeverIcon');
    fireEvent.click(deleteIcon);

    const cancelButton = getByRole('button', { name: 'No' });
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
  });

  it('should not delete if button no is clicked 1', () => {
    const mockSetDataSource = jest.fn();
    const mockSetOpenLogTimeModal = jest.fn();
    const mockOnSubmitCallback = jest.fn();

    const { getByText } = render(
      <ViewDetailLogTimeModal
        dataSource={mockDataSourceViewDetailWithDes}
        setOpenLogTimeModal={mockSetOpenLogTimeModal}
        setDataSource={mockSetDataSource}
        onSubmitCallback={mockOnSubmitCallback}
      />,
      { wrapper: ContextNeededWrapper }
    );

    const descriptionText = getByText('test data');

    expect(descriptionText).toBeInTheDocument();
  });
});

describe('TimesheetCalendar View Detail Modal', () => {
  jest.useFakeTimers();

  beforeAll(() => {
    (useGetTimePolicies as jest.Mock).mockReturnValue(mockTimePolicyData);
    (useGetUserTasksList as jest.Mock).mockReturnValue(mockTasksListData);
    (formatDateBasedOnStatementDate as jest.Mock).mockReturnValue(mockTimePolicyData.statementDate);
    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });
  });

  it('should call setDataSourceViewDetail when Add New log time', () => {
    const mockSetDataSourceViewDetail = jest.fn();
    const mockSetOpenLogTimeModal = jest.fn();

    const { getByRole } = render(
      <ViewDetailLogTimeModal
        dataSource={mockDataSourceViewDetail}
        setOpenLogTimeModal={mockSetOpenLogTimeModal}
        setDataSource={mockSetDataSourceViewDetail}
      />,
      { wrapper: ContextNeededWrapper }
    );

    const addNewButton = getByRole('button', { name: 'Add New' });
    fireEvent.click(addNewButton);

    expect(mockSetDataSourceViewDetail).toHaveBeenCalled();
    expect(mockSetOpenLogTimeModal).toHaveBeenCalled();
  });

  it('should close modal when click X icon', () => {
    const mockSetDataSourceViewDetail = jest.fn();
    const mockSetOpenLogTimeModal = jest.fn();

    const { getByTestId } = render(
      <ViewDetailLogTimeModal
        dataSource={mockDataSourceViewDetail}
        setOpenLogTimeModal={mockSetOpenLogTimeModal}
        setDataSource={mockSetDataSourceViewDetail}
      />,
      { wrapper: ContextNeededWrapper }
    );

    const closeIcon = getByTestId('CloseIcon');
    fireEvent.click(closeIcon);

    expect(mockSetDataSourceViewDetail).toHaveBeenCalled();
  });
});

describe('TimesheetCalendar No Data In View Detail Modal', () => {
  jest.useFakeTimers();

  beforeAll(() => {
    (useGetTimePolicies as jest.Mock).mockReturnValue(mockTimePolicyData);
    (useGetUserTasksList as jest.Mock).mockReturnValue(mockTasksListData);
    (formatDateBasedOnStatementDate as jest.Mock).mockReturnValue(mockTimePolicyData.statementDate);
    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });
  });

  it('should close modal when click X icon', () => {
    const mockSetDataSource = jest.fn();
    const mockSetOpenLogTimeModal = jest.fn();

    render(
      <ViewDetailLogTimeModal
        dataSource={mockEmptyDataSourceViewDetail}
        setOpenLogTimeModal={mockSetOpenLogTimeModal}
        setDataSource={mockSetDataSource}
      />,
      { wrapper: ContextNeededWrapper }
    );

    expect(mockSetDataSource).toHaveBeenCalled();
  });
});

describe('TimesheetCalendar Error', () => {
  beforeAll(() => {
    (useGetTimePolicies as jest.Mock).mockReturnValue(mockTimePolicyData);
    (useGetUserTasksList as jest.Mock).mockReturnValue(mockTasksListData);
    (formatDateBasedOnStatementDate as jest.Mock).mockReturnValue(mockTimePolicyData.statementDate);
    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });
  });

  it('should render content successfully', () => {
    const refetch = jest.fn();

    const { getByText } = render(<TimesheetCalendarError refetch={refetch} />, {
      wrapper: ContextNeededWrapper,
    });

    fireEvent.click(getByText('Reload Page'));
    expect(refetch).toHaveBeenCalled();
  });
});
