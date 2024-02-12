import ThemeProvider from '@ui-kit/contexts/theme-context';

import { fireEvent, render } from '@testing-library/react';

import ESPDaterangepicker from './date-range-picker';
import { ESPDaterangepicker as Daterangepicker } from './date-range-picker';

describe('Date range picker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <Daterangepicker />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should trigger onOpen func', () => {
    const { getByRole, baseElement } = render(
      <ThemeProvider>
        <ESPDaterangepicker label="Basic date picker" size="large" />
      </ThemeProvider>
    );

    const button = getByRole('button', { name: 'Choose date' });
    fireEvent.click(button);

    const content = baseElement.querySelector('.MuiPickersLayout-root');

    expect(content).toBeInTheDocument();
  });

  it('should render correct when change option', () => {
    const onChange = jest.fn();

    const { getByRole, getAllByRole, getByTestId } = render(
      <ThemeProvider>
        <ESPDaterangepicker label="Basic date picker" onChange={onChange} />
      </ThemeProvider>
    );

    const buttonCalendar = getByRole('button', { name: 'Choose date' });
    fireEvent.click(buttonCalendar);

    const dayList = getAllByRole('gridcell', { name: '30' });

    const startDate = Array.from(
      dayList.filter((item) => item.getAttribute('aria-selected') === 'false')
    );

    if (startDate[0]) {
      fireEvent.click(startDate[0]);
      fireEvent.mouseOver(startDate[0]);
      expect(onChange).not.toBeCalledTimes(1);
    }

    const valueStartTime = startDate[0].textContent;

    const endDate = getAllByRole('gridcell', { name: '29' });

    if (endDate) {
      fireEvent.click(endDate[0]);
      fireEvent.mouseOver(endDate[0]);
      fireEvent.mouseLeave(endDate[0]);
      expect(onChange).toBeCalledTimes(1);
    }

    const valueEndTime = endDate[0].textContent;

    const input = getByRole('textbox');
    const inputValue = input.getAttribute('value');

    expect(inputValue).toContain(valueEndTime && valueStartTime);

    fireEvent.click(getByTestId('CloseIcon'));

    expect(onChange).toBeCalledTimes(2);
  });
});
