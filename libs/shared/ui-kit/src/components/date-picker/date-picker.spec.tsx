import ThemeProvider from '@ui-kit/contexts/theme-context';
import { fireEvent, render } from '@testing-library/react';
import dayjs from 'dayjs';

import ESPDatepicker from './date-picker';
import { ESPDatepicker as DatePicker } from './date-picker';

describe('Date picker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPDatepicker />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully', () => {
    const defaultValue = dayjs(new Date());

    const { baseElement } = render(
      <ThemeProvider>
        <DatePicker />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render correct label and placeholder', () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <ThemeProvider>
        <ESPDatepicker label="Basic date picker" format="MM/DD/YYYY" size="small" />
      </ThemeProvider>
    );

    const label = getByLabelText('Basic date picker');
    const formatPlaceholder = getByPlaceholderText('MM/DD/YYYY');
    expect(label && formatPlaceholder).toBeInTheDocument();
  });

  it('should trigger open and close func', () => {
    const { getByRole, baseElement, getAllByRole } = render(
      <ThemeProvider>
        <ESPDatepicker label="Basic date picker" size="large" />
      </ThemeProvider>
    );

    const button = getByRole('button');
    fireEvent.click(button);

    const content = baseElement.querySelector('.MuiPickersLayout-root');

    expect(content).toBeInTheDocument();

    const dayList = getAllByRole('gridcell');
    const date = Array.from(dayList.filter((item) => item.getAttribute('aria-current') === 'date'));

    fireEvent.click(date[0]);
    expect(date[0].getAttribute('aria-selected="true'));
  });

  it('should render correct when have props disabledWeekend', () => {
    const { getByRole, getAllByRole } = render(
      <ThemeProvider>
        <DatePicker disabledWeekend />
      </ThemeProvider>
    );

    const button = getByRole('button');
    fireEvent.click(button);

    const dayList = getAllByRole('gridcell');
    const date = Array.from(
      dayList.filter(
        (item) =>
          item.getAttribute('aria-colindex') === '1' || item.getAttribute('aria-colindex') === '7'
      )
    );

    expect(date[0].classList.contains('Mui-disabled')).toBe(true);
  });
});
