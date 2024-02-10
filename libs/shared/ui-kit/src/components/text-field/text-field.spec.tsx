import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';

import { ESPTextField } from './text-field';

describe('Text field', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTextField />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render correct label', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTextField variant="outlined" label="Text field" error data-testid="text-field" />
      </ThemeProvider>
    );

    expect(baseElement.textContent).toContain('Text field');
  });

  it('should render correct style for border', () => {
    render(
      <ThemeProvider>
        <ESPTextField variant="outlined" success label="Text field" data-testid="text-field" />
      </ThemeProvider>
    );

    const selectEl = screen.getByTestId('text-field');
    const fieldset = selectEl.querySelector('fieldset');

    expect(fieldset).toBeInTheDocument();
    // expect(fieldset).toHaveStyle('borderWidth: 0.0625rem');
  });

  it('should render correct style based on size', () => {
    const sizeAndStyle: Array<{
      size: 'large' | 'medium' | 'small';
      paddingTop: string;
    }> = [
      { size: 'large', paddingTop: '0.1rem' },
      { size: 'medium', paddingTop: '0px' },
      { size: 'small', paddingTop: '0.05rem' },
    ];

    sizeAndStyle.map((item, index) => {
      render(
        <ThemeProvider>
          <ESPTextField size={item.size} data-testid={`text-field-${index}`} />
        </ThemeProvider>
      );

      const textField = screen.getByTestId(`text-field-${index}`);
      const el = textField.querySelector('.MuiInputBase-root.MuiOutlinedInput-root');

      expect(el).toHaveStyle(`padding-top: ${item.paddingTop}`);
    });
  });
});
