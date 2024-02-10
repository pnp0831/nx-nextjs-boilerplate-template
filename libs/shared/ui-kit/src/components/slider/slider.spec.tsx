import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';

import { ESPSlider } from './slider';

describe('ESPSlider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPSlider />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should render successfully', () => {
    render(
      <ThemeProvider>
        <ESPSlider defaultValue={50} data-testid="slider" />
      </ThemeProvider>
    );

    const slider = screen.getByTestId('slider');

    expect(slider).toBeInTheDocument();

    const input = slider.querySelector('input');

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('50');
  });
});
