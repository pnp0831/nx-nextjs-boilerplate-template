import ThemeProvider from '@ui-kit/contexts/theme-context';
import { MenuItem } from '@mui/material';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { theme } from '@ui-kit/theme';

import ESPDropdown from './dropdown';
import { ESPDropdown as DropdownComponent } from './dropdown';

describe('Dropdown', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <DropdownComponent />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPDropdown />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render if have link', () => {
    render(
      <ThemeProvider>
        <ESPDropdown link data-testid={'select'}>
          <MenuItem value={10}>Item 1</MenuItem>
        </ESPDropdown>
      </ThemeProvider>
    );

    const selectEl = screen.getByTestId('select');
    expect(selectEl).toBeInTheDocument();
  });

  it('should render correct border style if have props success', () => {
    render(
      <ThemeProvider>
        <ESPDropdown success data-testid={'select'}>
          <MenuItem value={10}>Item 1</MenuItem>
        </ESPDropdown>
      </ThemeProvider>
    );
    const selectEl = screen.getByTestId('select');
    const fieldset = selectEl.querySelector('fieldset');
    expect(fieldset).toHaveStyle(`border: 0.0625rem solid ${theme.palette.success.main}`);
  });

  it('should trigger onChange func', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <ESPDropdown data-testid={'select'}>
          <MenuItem value={10}>Item 1</MenuItem>
        </ESPDropdown>
      </ThemeProvider>
    );

    const selectCompoEl = getByTestId('select');

    const button = within(selectCompoEl).getByTestId('KeyboardArrowDownIcon');
    fireEvent.mouseDown(button);

    const optionEl = document.querySelectorAll('li');

    if (optionEl[1]) {
      fireEvent.click(optionEl[1]);

      const svgElement = optionEl[1].querySelector('svg[data-testid="CheckIcon"]');

      expect(svgElement).toBeInTheDocument();
    }
  });
});
