import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';

import { ESPBadge } from '.';
import Badge from './badge';

describe('ESPBadge', () => {
  it('should render successfully', () => {
    render(
      <ThemeProvider>
        <ESPBadge badgeContent={1}>testing</ESPBadge>
      </ThemeProvider>
    );

    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  it('should render successfully', () => {
    render(
      <ThemeProvider>
        <Badge badgeContent={1}>testing</Badge>
      </ThemeProvider>
    );
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render maxContent successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPBadge badgeContent={100}>testing</ESPBadge>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('should render dot successfully', () => {
    render(
      <ThemeProvider>
        <ESPBadge badgeContent={100} variant="dot" data-testid="badge">
          testing
        </ESPBadge>
      </ThemeProvider>
    );

    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByTestId('badge').querySelector('span.MuiBadge-dot')).toBeInTheDocument();
  });
});
