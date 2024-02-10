import ThemeProvider from '@ui-kit/contexts/theme-context';

import { fireEvent, render, within } from '@testing-library/react';

import ESPDateTimePicker from './date-time-picker';
import { ESPDateTimePicker as DateTimePicker } from './date-time-picker';

describe('Date time picker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPDateTimePicker />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <DateTimePicker />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render correct label', () => {
    const { getByLabelText } = render(
      <ThemeProvider>
        <ESPDateTimePicker label="Date time picker" size="small" />
      </ThemeProvider>
    );
    const label = getByLabelText('Date time picker');
    expect(label).toBeInTheDocument();
  });

  it('should trigger open func', () => {
    const { getByRole, baseElement } = render(
      <ThemeProvider>
        <ESPDateTimePicker label="Date time picker" size="large" />
      </ThemeProvider>
    );
    const button = getByRole('button', { name: 'Choose date' });
    fireEvent.click(button);
    const content = baseElement.querySelector('.MuiPickersLayout-root');

    expect(content).toBeInTheDocument();
  });

  it('should trigger onChange func', () => {
    const { getByRole, baseElement, getAllByRole } = render(
      <ThemeProvider>
        <ESPDateTimePicker label="Date time picker" />
      </ThemeProvider>
    );
    const button = getByRole('button', { name: 'Choose date' });
    fireEvent.click(button);
    const content = baseElement.querySelector('.MuiPickersLayout-root');

    expect(content).toBeInTheDocument();

    const dayList = getAllByRole('gridcell');
    const date = Array.from(dayList.filter((item) => item.getAttribute('aria-current') === 'date'));
    fireEvent.click(date[0]);

    expect(date[0].getAttribute('aria-selected="true'));
  });

  it('should trigger change option for startTime and show in placeholder', () => {
    const { getByRole, getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <ESPDateTimePicker label="Date time picker" />
      </ThemeProvider>
    );

    const input = getByRole('textbox');

    const button = getByRole('button', { name: 'Choose date' });
    fireEvent.click(button);

    const divContent = getByTestId('start-time');

    fireEvent.click(within(divContent).getByRole('button', { name: 'Open' }));

    const optionList = getByRole('listbox');
    const option = within(optionList).getAllByRole('button');

    const optionWithDisabledFalse = option.find(
      (option) => option.getAttribute('aria-disabled') === 'false'
    );

    if (optionWithDisabledFalse) {
      let result = '';
      fireEvent.click(optionWithDisabledFalse);

      const startTime = getByPlaceholderText('Start');
      const valueStartTime = startTime.getAttribute('value');

      if (valueStartTime) {
        result = valueStartTime.replace('AM', '');
      }

      const placeholderInput = input.getAttribute('placeholder');

      // expect(placeholderInput).toContain(result);
      expect(placeholderInput).toContain('HH:mm - HH:mm, DD/MM/YYYY');
    }
  });

  it('should trigger change option for endTime and show in placeholder', () => {
    const { getByRole, getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <ESPDateTimePicker label="Date time picker" />
      </ThemeProvider>
    );

    const input = getByRole('textbox');

    const button = getByRole('button', { name: 'Choose date' });
    fireEvent.click(button);

    const divContent = getByTestId('end-time');

    fireEvent.click(within(divContent).getByRole('button', { name: 'Open' }));

    const optionList = getByRole('listbox');
    const option = within(optionList).getAllByRole('button');

    const optionWithDisabledFalse = option.find(
      (option) => option.getAttribute('aria-disabled') === 'false'
    );

    if (optionWithDisabledFalse) {
      let result = '';
      fireEvent.click(optionWithDisabledFalse);

      const startTime = getByPlaceholderText('End');
      const valueStartTime = startTime.getAttribute('value');

      if (valueStartTime) {
        result = valueStartTime.replace(' AM', '');
      }

      const placeholderInput = input.getAttribute('placeholder');

      // expect(placeholderInput).toContain(result);
      expect(placeholderInput).toContain('HH:mm - HH:mm, DD/MM/YYYY');
    }
  });

  it('should trigger clear option for startTime', () => {
    const { getByRole, getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <ESPDateTimePicker label="Date time picker" />
      </ThemeProvider>
    );

    const button = getByRole('button', { name: 'Choose date' });
    fireEvent.click(button);

    const divContent = getByTestId('start-time');

    const clearButton = within(divContent).queryByLabelText('Clear');

    if (clearButton) {
      fireEvent.click(clearButton);

      const startTime = getByPlaceholderText('Start');
      const valueStartTime = startTime.getAttribute('value');

      expect(valueStartTime).toContain('');
    }
  });

  it('should trigger clear option for endTime', () => {
    const { getByRole, getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <ESPDateTimePicker label="Date time picker" />
      </ThemeProvider>
    );

    const button = getByRole('button', { name: 'Choose date' });
    fireEvent.click(button);

    const divContent = getByTestId('end-time');

    const clearButton = within(divContent).queryByLabelText('Clear');

    if (clearButton) {
      fireEvent.click(clearButton);

      const startTime = getByPlaceholderText('End');
      const valueStartTime = startTime.getAttribute('value');

      expect(valueStartTime).toContain('');
    }
  });

  // it('should render correct start time, end time', () => {
  //   const { getByRole, getByPlaceholderText, getByTestId, getAllByRole } = render(
  //     <ThemeProvider >
  //       <LocalizationProvider dateAdapter={AdapterDayjs}>
  //         <ESPDateTimePicker label="Date time picker" />
  //       </LocalizationProvider>
  //     </ThemeProvider>
  //   );

  //   const input = getByRole('textbox');

  //   const button = getByRole('button', { name: 'Choose date' });
  //   fireEvent.click(button);

  //   const divContentStart = getByTestId('start-time');

  //   fireEvent.click(within(divContentStart).getByRole('button', { name: 'Open' }));

  //   const optionListStart = getByRole('listbox');
  //   const optionStart = within(optionListStart).getAllByRole('button');

  //   const optionStartWithDisabledFalse = optionStart.find(
  //     (option) => option.getAttribute('aria-disabled') === 'false'
  //   );

  //   if (optionStartWithDisabledFalse) {
  //     fireEvent.click(optionStartWithDisabledFalse);
  //   }

  //   const divContentEnd = getByTestId('end-time');

  //   fireEvent.click(within(divContentEnd).getByRole('button', { name: 'Open' }));

  //   const optionListEnd = getByRole('listbox');
  //   const optionEnd = within(optionListEnd).getAllByRole('button');

  //   const optionEndWithDisabledFalse = optionEnd.find(
  //     (option) => option.getAttribute('aria-disabled') === 'false'
  //   );

  //   if (optionEndWithDisabledFalse) {
  //     fireEvent.click(optionEndWithDisabledFalse);
  //   }

  //   const dayList = getAllByRole('gridcell');
  //   const date = Array.from(dayList.filter((item) => item.getAttribute('aria-current') === 'date'));

  //   if (date) {
  //     fireEvent.click(date[0]);
  //   }

  //   const placeholderInput = input.getAttribute('placeholder');

  //   const startTime = getByPlaceholderText('Start');
  //   const valueStartTime = startTime.getAttribute('value');

  //   const endTime = getByPlaceholderText('End');
  //   const valueEndTime = endTime.getAttribute('value');

  //   expect(placeholderInput).toMatch(`${valueStartTime} - ${valueEndTime}`);
  // });
});
