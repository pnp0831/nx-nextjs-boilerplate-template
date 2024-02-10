import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';

import { ESPSwitch } from '.';

describe('ESPSwitch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPSwitch />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render defaultChecked successfully', () => {
    render(
      <ThemeProvider>
        <ESPSwitch defaultChecked data-testid="checkbox" />
      </ThemeProvider>
    );

    const switchcomponent = screen.getByTestId('checkbox');

    expect(switchcomponent).toBeInTheDocument();
    expect(switchcomponent).toHaveClass('Mui-checked');
  });
});
