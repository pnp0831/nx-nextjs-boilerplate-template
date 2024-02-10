import ThemeProvider from '@ui-kit/contexts/theme-context';
import { fireEvent, render, screen } from '@testing-library/react';

import dayjs from 'dayjs';

import { ESPCalendar } from '.';
import ESPCalendarComppnent from './calendar';

describe('ESPCalendar', () => {
  it('should render successfully', () => {
    const format = 'DD/MM/YYYY';
    const { baseElement } = render(
      <ThemeProvider>
        <ESPCalendar
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should render successfully', () => {
    const format = 'DD/MM/YYYY';

    render(
      <ThemeProvider>
        <ESPCalendarComppnent
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('WED')).toBeInTheDocument();
    expect(screen.getByText(dayjs().format('MMMM YYYY'))).toBeInTheDocument();

    const backIcon = screen.getByTestId('ArrowBackIosNewIcon');

    fireEvent.click(backIcon);

    expect(screen.getByText(dayjs().subtract(1, 'M').format('MMMM YYYY'))).toBeInTheDocument();

    const nextIcon = screen.getByTestId('ArrowForwardIosIcon');

    fireEvent.click(nextIcon);
    fireEvent.click(nextIcon);

    expect(screen.getByText(dayjs().add(1, 'M').format('MMMM YYYY'))).toBeInTheDocument();

    fireEvent.click(screen.getByText('Today'));

    expect(screen.getByText(dayjs().format('MMMM YYYY'))).toBeInTheDocument();
  });

  it('should render successfully disabledWeekend', () => {
    const format = 'DD/MM/YYYY';

    render(
      <ThemeProvider>
        <ESPCalendarComppnent
          disabledWeekend
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </ThemeProvider>
    );
  });

  it('should render successfully disabledFuture', () => {
    const format = 'DD/MM/YYYY';

    render(
      <ThemeProvider>
        <ESPCalendarComppnent
          disabledFuture
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </ThemeProvider>
    );
  });

  it('should render successfully disabledPast', () => {
    const format = 'DD/MM/YYYY';

    render(
      <ThemeProvider>
        <ESPCalendarComppnent
          disabledPast
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </ThemeProvider>
    );
  });

  it('should render successfully shouldDisabledDate', () => {
    const format = 'DD/MM/YYYY';
    const shouldDisabledDateMock = jest.fn();

    render(
      <ThemeProvider>
        <ESPCalendarComppnent
          shouldDisabledDate={shouldDisabledDateMock}
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </ThemeProvider>
    );

    expect(shouldDisabledDateMock).toHaveBeenCalled();
  });

  it('should render successfully without shouldDisabledDate', () => {
    const format = 'DD/MM/YYYY';
    const shouldDisabledDateMock = jest.fn();

    render(
      <ThemeProvider>
        <ESPCalendarComppnent
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </ThemeProvider>
    );

    expect(shouldDisabledDateMock).not.toHaveBeenCalled();
  });

  it('should render successfully with default date', () => {
    const setCurrentDateMock = jest.fn();
    render(
      <ThemeProvider>
        <ESPCalendarComppnent
          currentDate={dayjs().add(1, 'm')}
          events={{}}
          setCurrentDate={setCurrentDateMock}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('WED')).toBeInTheDocument();
    expect(screen.getByText(dayjs().add(1, 'm').format('MMMM YYYY'))).toBeInTheDocument();

    const backIcon = screen.getByTestId('ArrowBackIosNewIcon');

    fireEvent.click(backIcon);

    expect(setCurrentDateMock).toHaveBeenCalled();
  });

  it('should render successfully with action', async () => {
    const onAddMock = jest.fn();
    const onEditMock = jest.fn();

    const format = 'DD/MM/YYYY';

    render(
      <ThemeProvider>
        <ESPCalendarComppnent
          onAdd={onAddMock}
          onEdit={onEditMock}
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </ThemeProvider>
    );

    const isLastDayOfMonth = dayjs().endOf('month').date() === dayjs().date();
    const isFristDayOfMonth = dayjs().startOf('month').date() === dayjs().date();

    let addEvent = screen.getByTestId(`day-${dayjs().subtract(1, 'd').format(format)}`);

    if (isLastDayOfMonth) {
      addEvent = screen.getByTestId(`day-${dayjs().subtract(1, 'd').format(format)}`);
    }

    if (isFristDayOfMonth) {
      addEvent = screen.getByTestId(`day-${dayjs().add(2, 'd').format(format)}`);
    }

    expect(addEvent).toBeInTheDocument();

    fireEvent.mouseDown(addEvent);
    fireEvent.mouseOver(addEvent);
    fireEvent.mouseUp(addEvent);
    fireEvent.click(addEvent);

    const addEventIcon = addEvent.querySelector('.MuiSvgIcon-root');

    if (addEventIcon) {
      fireEvent.click(addEventIcon as Element);
      expect(onAddMock).toHaveBeenCalled();
    }

    const editEvent = screen.getByTestId(`day-${dayjs().format(format)}`);

    expect(editEvent).toBeInTheDocument();

    fireEvent.mouseOver(editEvent);

    const editEventIcon = editEvent.querySelector('.MuiSvgIcon-root');

    if (editEventIcon) {
      fireEvent.click(editEventIcon as Element);
      expect(onEditMock).toHaveBeenCalled();
    }
  });

  it('should render successfully without action', async () => {
    const onAddMock = jest.fn();
    const onEditMock = jest.fn();

    const format = 'DD/MM/YYYY';

    render(
      <ThemeProvider>
        <ESPCalendarComppnent
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </ThemeProvider>
    );

    const isLastDayOfMonth = dayjs().endOf('month').date() === dayjs().date();
    const isFristDayOfMonth = dayjs().startOf('month').date() === dayjs().date();

    let addEvent = screen.getByTestId(`day-${dayjs().subtract(1, 'd').format(format)}`);

    if (isLastDayOfMonth) {
      addEvent = screen.getByTestId(`day-${dayjs().subtract(1, 'd').format(format)}`);
    }

    if (isFristDayOfMonth) {
      addEvent = screen.getByTestId(`day-${dayjs().add(2, 'd').format(format)}`);
    }

    expect(addEvent).toBeInTheDocument();

    fireEvent.mouseOver(addEvent);

    const addEventIcon = addEvent.querySelector('.MuiSvgIcon-root');

    if (addEventIcon) {
      fireEvent.click(addEventIcon as Element);
      expect(onAddMock).not.toHaveBeenCalled();
    }

    const editEvent = screen.getByTestId(`day-${dayjs().format(format)}`);

    expect(editEvent).toBeInTheDocument();

    fireEvent.mouseOver(editEvent);

    const editEventIcon = editEvent.querySelector('.MuiSvgIcon-root');

    if (editEventIcon) {
      fireEvent.click(editEventIcon as Element);
      expect(onEditMock).not.toHaveBeenCalled();
    }
  });
});
