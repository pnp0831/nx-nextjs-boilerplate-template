import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';
import { theme } from '@ui-kit/theme';

import { ESPTag } from './tag';

describe('ESPTag', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTag />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render correct if have props color', () => {
    const color = 'primary';
    render(
      <ThemeProvider>
        <ESPTag color={color} data-testid={'tag'} />
      </ThemeProvider>
    );

    const tagElement = screen.getByTestId('tag');

    expect(tagElement).toHaveStyle(`color: ${theme.palette.common.white}`);
  });

  it('should render correct if dont have props color', () => {
    render(
      <ThemeProvider>
        <ESPTag data-testid={'tag'} />
      </ThemeProvider>
    );

    const tagElement = screen.getByTestId('tag');

    expect(tagElement).toHaveStyle('color: rgb(255, 255, 255)');
  });
});
