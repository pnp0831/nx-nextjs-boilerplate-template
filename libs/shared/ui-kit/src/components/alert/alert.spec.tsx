import ThemeProvider from '@ui-kit/contexts/theme-context';
import { fireEvent, render } from '@testing-library/react';

import { ESPAlert as AlertComponent } from '.';
import ESPAlert from './alert';

describe('Alert', () => {
  it('should render default alert successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPAlert />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render alert successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <AlertComponent />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('calls handleClose when alert is closed', () => {
    const onCloseMock = jest.fn();

    const { getByRole } = render(
      <ThemeProvider>
        <AlertComponent onClose={onCloseMock} />
      </ThemeProvider>
    );

    const alertElement = getByRole('button');

    fireEvent.click(alertElement);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
