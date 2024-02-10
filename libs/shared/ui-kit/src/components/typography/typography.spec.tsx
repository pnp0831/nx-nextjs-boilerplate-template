import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';

import { ESPTypography } from './typography';

describe('ESPTypography', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTypography>Test</ESPTypography>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
