import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render } from '@testing-library/react';

import { ESPFormControlLabel } from './form-control-label';
import ESPCheckbox from '../checkbox/checkbox';

describe('ESPFormControlLabel', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ThemeProvider>
        <ESPFormControlLabel control={<ESPCheckbox />} label="Checkbox validate" />
      </ThemeProvider>
    );

    expect(getByText('Checkbox validate')).toBeInTheDocument();

    expect(baseElement).toBeTruthy();
  });
});
