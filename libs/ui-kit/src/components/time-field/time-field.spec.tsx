import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render } from '@testing-library/react';

import { ESPTimeField } from './time-field';

describe('ESPTimeField', () => {
  it('should render successfully with default props', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTimeField />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
