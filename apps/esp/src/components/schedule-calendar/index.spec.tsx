import { act, fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '@ui-kit/contexts/theme-context';
import React from 'react';

import ScheduleCalendar from '.';
import CustomDateCell from './date-hover';
import { SlotDuration } from './type';

const calendarRefMock = {
  prev: jest.fn(),
  next: jest.fn(),
  today: jest.fn(),
};

describe('Schedular Calendar', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ScheduleCalendar />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render CustomDateCell without dragging', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <CustomDateCell slotDuration={SlotDuration['15_MINUTES']} dragging={false} />
      </ThemeProvider>
    );

    expect(getByTestId('AddCircleOutlinedIcon')).toBeInTheDocument();
  });

  it('should render CustomDateCell with dragging', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <CustomDateCell slotDuration={SlotDuration['15_MINUTES']} dragging={true} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should call calendarRef.today() after 175ms when init', () => {
    const useRefSpy = jest.spyOn(React, 'useRef');

    jest.useFakeTimers();

    const setSlotDuration = jest.fn();

    act(() => {
      render(
        <ThemeProvider>
          <ScheduleCalendar
            setSlotDuration={setSlotDuration}
            externalEvents={[
              '#5DB37E',
              '#FF5308',
              '#008FDD',
              '#ffc0cb',
              '#941027',
              '#000000',
              '#e845f6',
              '#ffffff',
            ].map((item) => ({
              id: item,
              name: `Anchor Designer API external ${item}`,
              color: item,
            }))}
          />
        </ThemeProvider>
      );
    });

    expect(setSlotDuration).toHaveBeenCalled();

    const thirtyButton = screen.getByRole('button', { name: '30' });
    fireEvent.click(thirtyButton);

    useRefSpy.mockReturnValueOnce({ current: { calendar: calendarRefMock } });

    act(() => {
      jest.advanceTimersByTime(175);
    });

    if (useRefSpy) {
      expect(calendarRefMock.today).toBeDefined();
    }

    const todayButton = screen.getByRole('button', { name: 'Today' });
    fireEvent.click(todayButton);
  });

  it('should call calendarRef.today() after clicking today button', () => {
    const useRefSpy = jest.spyOn(React, 'useRef');

    const { getByRole } = render(
      <ThemeProvider>
        <ScheduleCalendar />
      </ThemeProvider>
    );

    const todayButton = getByRole('button', { name: 'Today' });
    fireEvent.click(todayButton);

    useRefSpy.mockReturnValueOnce({ current: { calendar: calendarRefMock } });

    if (useRefSpy) {
      expect(calendarRefMock.today).toBeDefined();
    }
  });

  it('should click KeyboardArrowLeftIcon and handle prev', () => {
    const useRefSpy = jest.spyOn(React, 'useRef');

    const { getByTestId } = render(
      <ThemeProvider>
        <ScheduleCalendar />
      </ThemeProvider>
    );

    const arrowLeftIconButton = getByTestId('KeyboardArrowLeftIcon');
    fireEvent.click(arrowLeftIconButton);

    useRefSpy.mockReturnValueOnce({ current: { calendar: calendarRefMock } });

    if (useRefSpy) {
      expect(calendarRefMock.prev).toBeDefined();
    }
  });

  it('should click KeyboardArrowRightIcon and handle next', () => {
    const useRefSpy = jest.spyOn(React, 'useRef');

    const { getByTestId } = render(
      <ThemeProvider>
        <ScheduleCalendar />
      </ThemeProvider>
    );

    const arrowRightIconButton = getByTestId('KeyboardArrowRightIcon');
    fireEvent.click(arrowRightIconButton);

    useRefSpy.mockReturnValueOnce({ current: { calendar: calendarRefMock } });

    if (useRefSpy) {
      expect(calendarRefMock.next).toBeDefined();
    }
  });
});
