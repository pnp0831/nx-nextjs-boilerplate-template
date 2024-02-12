import ThemeProvider from '@ui-kit/contexts/theme-context';
import { FormControlLabel } from '@mui/material';
import { render } from '@testing-library/react';
import { theme } from '@ui-kit/theme';

import ESPCheckbox from './checkbox';
import { ESPCheckbox as Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <FormControlLabel control={<ESPCheckbox />} label="Checked" />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <FormControlLabel control={<Checkbox />} label="Checked" />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render checked icon if have props defaulCheck', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <FormControlLabel
          control={<ESPCheckbox defaultChecked data-testid={'checkbox'} />}
          label="Checked"
        />
      </ThemeProvider>
    );

    const checkbox = getByTestId('checkbox');

    const svgElement = checkbox.querySelector('svg[data-testid="CheckBoxIcon"]');
    expect(svgElement).toBeInTheDocument();
  });

  it('should render correct style if have props round', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <FormControlLabel
          control={<ESPCheckbox round data-testid={'checkbox'} />}
          label="Checked"
        />
      </ThemeProvider>
    );

    const checkbox = getByTestId('checkbox');

    const svgElement = checkbox.querySelector('svg[data-testid="RadioButtonUncheckedIcon"]');

    expect(svgElement).toBeInTheDocument();
  });

  it('should render label', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <FormControlLabel
          data-testid={'checkbox'}
          control={<ESPCheckbox round />}
          label="Checked"
        />
      </ThemeProvider>
    );

    expect(baseElement.textContent).toEqual('Checked');
  });

  it('should render correct style if have props eror', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <FormControlLabel
          control={<ESPCheckbox error data-testid={'checkbox'} />}
          label="Checked"
        />
      </ThemeProvider>
    );

    const checkbox = getByTestId('checkbox');

    const svgElement = checkbox.querySelector('svg[data-testid="CheckBoxOutlineBlankIcon"]');

    expect(svgElement).toHaveStyle('color: #C84040');
  });

  it('should render correct style if have props round & error', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <FormControlLabel
          control={<ESPCheckbox error round data-testid={'checkbox'} />}
          label="Checked"
        />
      </ThemeProvider>
    );

    const checkbox = getByTestId('checkbox');

    const svgElement = checkbox.querySelector('svg[data-testid="RadioButtonUncheckedIcon"]');

    expect(svgElement).toHaveStyle('color: #C84040');
  });
});
