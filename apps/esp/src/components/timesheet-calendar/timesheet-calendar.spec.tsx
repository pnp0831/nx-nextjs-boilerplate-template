import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '@ui-kit/contexts/theme-context';
import dayjs from 'dayjs';
import React from 'react';

import { ESPTimesheetCalendar } from './timesheet-calendar';

const format = 'DD/MM/YYYY';
const EVENTS = [
  {
    taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
    data: {
      [dayjs().format(format)]: {
        rawData: [
          {
            description: '',
            duration: 600,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-19T02:00:00+00:00',
            startDate: '2023-12-19T01:00:00+00:00',
            taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
            id: 'f7470b95-6aba-4a68-dcd5-08dbff9ad905',
          },
          {
            description: '',
            duration: 60,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-19T02:00:00+00:00',
            startDate: '2023-12-19T01:00:00+00:00',
            taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
            id: '877ce9df-bf2f-4f5a-dcd8-08dbff9ad905',
          },
          {
            description: '',
            duration: 60,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-19T02:00:00+00:00',
            startDate: '2023-12-19T01:00:00+00:00',
            taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
            id: 'e68b6c57-8123-4126-dcd9-08dbff9ad905',
          },
          {
            description: '',
            duration: 60,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-19T02:00:00+00:00',
            startDate: '2023-12-19T01:00:00+00:00',
            taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
            id: 'c86a5b83-fde8-459c-dcda-08dbff9ad905',
          },
        ],
        logged: 4,
      },
      [dayjs().subtract(1, 'd').format(format)]: {
        rawData: [
          {
            description: '',
            duration: 60,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-18T02:00:00+00:00',
            startDate: '2023-12-18T01:00:00+00:00',
            taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
            id: 'bf1e1b48-f87f-4239-dcd6-08dbff9ad905',
          },
        ],
        logged: 1,
      },
      [dayjs().subtract(2, 'd').format(format)]: {
        rawData: [
          {
            description: '',
            duration: 60,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-15T02:00:00+00:00',
            startDate: '2023-12-15T01:00:00+00:00',
            taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
            id: '7ce950b5-c2c4-4f6c-dcd7-08dbff9ad905',
          },
        ],
        logged: 1,
      },
      [dayjs().add(1, 'd').format(format)]: {
        rawData: [
          {
            description: '',
            duration: 60,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-20T02:00:00+00:00',
            startDate: '2023-12-20T01:00:00+00:00',
            taskId: '2c08b4ed-4dce-4cf4-4018-08db94951482',
            id: '0bfd3cb6-4e51-4677-dcdb-08dbff9ad905',
          },
        ],
        logged: 1,
      },
    },
    totalLogged: 7,
    overtimeLogged: 0,
  },
  {
    taskId: 'cc001100-f30a-4a0e-1b0a-08dbd9f11a3b',
    data: {
      [dayjs().add(1, 'd').format(format)]: {
        rawData: [
          {
            description: '',
            duration: 60,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-20T02:00:00+00:00',
            startDate: '2023-12-20T01:00:00+00:00',
            taskId: 'cc001100-f30a-4a0e-1b0a-08dbd9f11a3b',
            id: '93ec663a-8dab-4c0c-dcdc-08dbff9ad905',
          },
        ],
        logged: 1,
      },
    },
    totalLogged: 1,
    overtimeLogged: 0,
  },
  {
    taskId: 'eb7e154c-0fb4-4524-1b0b-08dbd9f11a3b',
    data: {
      [dayjs().add(1, 'd').format(format)]: {
        rawData: [
          {
            description: '',
            duration: 60,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-20T02:00:00+00:00',
            startDate: '2023-12-20T01:00:00+00:00',
            taskId: 'eb7e154c-0fb4-4524-1b0b-08dbd9f11a3b',
            id: '10766c2b-3982-4879-dcdd-08dbff9ad905',
          },
        ],
        logged: 1,
      },
      [dayjs().add(2, 'd').format(format)]: {
        rawData: [
          {
            description: '',
            duration: 60,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-04T02:00:00+00:00',
            startDate: '2023-12-04T01:00:00+00:00',
            taskId: 'eb7e154c-0fb4-4524-1b0b-08dbd9f11a3b',
            id: '3a7c8b6e-fca9-4805-dcdf-08dbff9ad905',
          },
        ],
        logged: 1,
      },
    },
    totalLogged: 2,
    overtimeLogged: 0,
  },
  {
    taskId: 'a8600314-4d4f-4b0f-1b0d-08dbd9f11a3b',
    data: {
      [dayjs().add(1, 'd').format(format)]: {
        rawData: [
          {
            description: '',
            duration: 480,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-20T09:00:00+00:00',
            startDate: '2023-12-20T01:00:00+00:00',
            taskId: 'a8600314-4d4f-4b0f-1b0d-08dbd9f11a3b',
            id: 'fcf72324-6f38-48f9-dcde-08dbff9ad905',
          },
        ],
        logged: 8,
      },
      [dayjs().add(3, 'd').format(format)]: {
        rawData: [
          {
            description: '',
            duration: 480,
            employeeId: '8868ce3e-f1f3-4961-b995-683172f023f8',
            endDate: '2023-12-05T09:00:00+00:00',
            startDate: '2023-12-05T01:00:00+00:00',
            taskId: 'a8600314-4d4f-4b0f-1b0d-08dbd9f11a3b',
            id: '6bd2cbe4-7960-4634-dce0-08dbff9ad905',
          },
        ],
        logged: 8,
      },
    },
    totalLogged: 16,
    overtimeLogged: 0,
  },
  {
    name: 'Subtotal',
    totalLogged: 26,
    data: {
      [dayjs().format(format)]: {
        logged: 12,
        overrtime: 0,
      },
      [dayjs().subtract(1, 'd').format(format)]: {
        logged: 1,
        overrtime: 0,
      },
      [dayjs().subtract(2, 'd').format(format)]: {
        logged: 1,
        overrtime: 0,
      },
      [dayjs().add(1, 'd').format(format)]: {
        logged: 11,
        overrtime: 0,
      },
      [dayjs().add(2, 'd').format(format)]: {
        logged: 0,
        overrtime: 0,
      },
      [dayjs().add(3, 'd').format(format)]: {
        logged: 8,
        overrtime: 0,
      },
    },
    taskId: '',
    isSubtotal: true,
  },
];

const timesheetAttendance = {
  [dayjs().format(format)]: {
    start: '07:30',
    end: '17:30',
    remark: 'No Remark',
  },
  [dayjs().add(1, 'd').format(format)]: {
    start: '07:30',
    end: '?',
    remark: 'Missing Check-out',
  },
  [dayjs().add(2, 'd').format(format)]: {
    start: '10:30',
    end: '17:30',
    remark: 'Late in',
  },
  [dayjs().subtract(1, 'd').format(format)]: {
    start: '07:30',
    end: '17:30',
    remark: 'No Remark',
  },
  [dayjs().subtract(1, 'd').format(format)]: {
    start: '07:30',
    end: '14:30',
    remark: 'Early out',
  },
};

const statementDate = dayjs().subtract(5, 'day');

describe('Timesheet Calendar', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTimesheetCalendar minWidth="10rem" />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully', () => {
    const onDateChange = jest.fn();

    const { baseElement } = render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
          attendanceLogs={timesheetAttendance}
          statementDate={statementDate}
        />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render loading successfully', () => {
    const onDateChange = jest.fn();

    const { baseElement } = render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
          attendanceLogs={timesheetAttendance}
          statementDate={statementDate}
          loading
        />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should trigger button click back to previous month ', () => {
    const onDateChange = jest.fn();

    render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          statementDate={statementDate}
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
        />
      </ThemeProvider>
    );

    const arrowBack = screen.getByTestId('ArrowBackIosNewIcon');
    fireEvent.click(arrowBack);

    expect(onDateChange).toBeCalledTimes(1);
  });

  it('should trigger button click to next month ', () => {
    const onDateChange = jest.fn();

    render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          statementDate={statementDate}
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
        />
      </ThemeProvider>
    );

    const arrowBack = screen.getByTestId('ArrowForwardIosIcon');
    fireEvent.click(arrowBack);

    expect(onDateChange).toBeCalledTimes(1);
  });

  it('should trigger onAdd func', () => {
    const onDateChange = jest.fn();
    const onAdd = jest.fn();

    render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
          onAdd={onAdd}
          statementDate={statementDate}
        />
      </ThemeProvider>
    );

    const addIcon = screen.queryAllByTestId('AddCircleOutlinedIcon');

    fireEvent.click(addIcon[1]);
    expect(onAdd).toBeCalledTimes(1);
  });

  it('should trigger onEdit func', () => {
    const onDateChange = jest.fn();
    const onView = jest.fn(() => {});

    render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
          onView={onView}
          statementDate={statementDate}
        />
      </ThemeProvider>
    );

    const editIcon = screen.queryAllByTestId('RemoveRedEyeIcon');

    fireEvent.click(editIcon[0]);
    if (onView) {
      expect(onView).toBeCalledTimes(1);
    }
  });

  it('should not call onEdit if no props', () => {
    const onDateChange = jest.fn();
    const onView = undefined;

    render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
          onView={onView}
          statementDate={statementDate}
        />
      </ThemeProvider>
    );

    const editButton = screen.queryAllByTestId('RemoveRedEyeIcon');

    fireEvent.click(editButton[0]);
    expect(onView).toBeUndefined();
  });

  it('should not call onAdd if no props', () => {
    const onDateChange = jest.fn();
    const onAdd = undefined;

    render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          statementDate={statementDate}
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
        />
      </ThemeProvider>
    );

    const addButton = screen.queryAllByTestId('AddCircleOutlinedIcon');

    fireEvent.click(addButton[0]);
    expect(onAdd).toBeUndefined();
  });

  it('should render label of button Today ', () => {
    const onDateChange = jest.fn();

    const { getByText } = render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          statementDate={statementDate}
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
        />
      </ThemeProvider>
    );

    const todayButton = getByText('Today');

    fireEvent.click(todayButton);
  });

  it('should trigger table scrollto', () => {
    //TODO: handle table.scrollTo
    const onDateChange = jest.fn();
    jest.useFakeTimers();

    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useRef: jest.fn(),
      useEffect: jest.fn(),
    }));

    const mockScrollTo = jest.fn();
    const refTable = { current: { scrollTo: mockScrollTo } };
    jest.spyOn(React, 'useRef').mockReturnValue(refTable);

    const { getByRole } = render(
      <ThemeProvider>
        <ESPTimesheetCalendar
          statementDate={statementDate}
          onDateChange={onDateChange}
          currentDate={dayjs()}
          events={EVENTS}
        />
      </ThemeProvider>
    );

    const button = getByRole('button');

    fireEvent.click(button);
    jest.advanceTimersByTime(1000);
  });
});
