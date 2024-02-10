import ThemeProvider from '@ui-kit/contexts/theme-context';
import { fireEvent, render } from '@testing-library/react';

import ESPTimepicker from '.';

describe('Time Picker', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTimepicker />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render option in dropdown successfully', () => {
    const { getByPlaceholderText, getByText } = render(
      <ThemeProvider>
        <ESPTimepicker disablePast size="large" amPmAriaLabel="PM" />
      </ThemeProvider>
    );

    const input = getByPlaceholderText('HH:mm');
    fireEvent.mouseDown(input);

    const option1 = getByText('0:00 PM');
    const option2 = getByText('0:30 PM');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();

    fireEvent.mouseDown(input);
  });

  it('should render multiple tag successfully', () => {
    const { getByPlaceholderText, getByText, getByRole } = render(
      <ThemeProvider>
        <ESPTimepicker disablePast size="large" amPmAriaLabel="PM" limitTags={3} multiple />
      </ThemeProvider>
    );

    const input = getByPlaceholderText('HH:mm');
    fireEvent.mouseDown(input);

    const option1 = getByText('0:30 PM');
    fireEvent.click(option1);

    // fireEvent.mouseDown(input);
    // const option2 = getByText('1:30 PM');
    // fireEvent.click(option2);

    // fireEvent.mouseDown(input);
    // const option3 = getByText('2:30 PM');
    // fireEvent.click(option3);

    const labelOption1 = getByRole('button', { name: '0:30 PM' });
    // const labelOption2 = getByRole('button', { name: '1:30 PM' });
    // const labelOption3 = getByRole('button', { name: '2:30 PM' });

    expect(labelOption1).toBeInTheDocument();
  });

  it('should render more than limitTags successfully', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <ThemeProvider>
        <ESPTimepicker disablePast size="large" amPmAriaLabel="PM" limitTags={3} multiple />
      </ThemeProvider>
    );

    const input = getByPlaceholderText('HH:mm');
    fireEvent.mouseDown(input);

    const option1 = getByText('0:30 PM');
    fireEvent.click(option1);

    fireEvent.mouseDown(input);
    const option2 = getByText('1:30 PM');
    fireEvent.click(option2);

    fireEvent.mouseDown(input);
    const option3 = getByText('2:30 PM');
    fireEvent.click(option3);

    fireEvent.mouseDown(input);
    const option4 = getByText('3:30 PM');
    fireEvent.click(option4);

    const tooltip = getByTestId('more');
    expect(tooltip).toBeInTheDocument();
  });
});
