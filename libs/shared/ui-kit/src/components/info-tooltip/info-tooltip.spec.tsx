import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render } from '@testing-library/react';

import { ESPInfoTooltip } from './info-tooltip';

describe('ESPInfoTooltip', () => {
  it('should render successfully with default props', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPInfoTooltip content={'Hi'} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
  it('should render successfully with default props', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPInfoTooltip content={'Hi'} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
