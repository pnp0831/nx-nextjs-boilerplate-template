import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';
import { theme } from '@ui-kit/theme';

import { ESPCollapse } from '.';
import ESPCollapseComponent from './collapse';

describe('ESPCollapse', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPCollapse>
          <button>I'm in collapse</button>
        </ESPCollapse>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should render open collapse successfully', () => {
    render(
      <ThemeProvider>
        <ESPCollapseComponent in>
          <button>I'm in collapse</button>
        </ESPCollapseComponent>
      </ThemeProvider>
    );

    expect(screen.getByText(`I'm in collapse`)).toBeInTheDocument();
  });
});
