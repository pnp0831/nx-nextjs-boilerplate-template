import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';

import { ESPTooltip } from '.';
import Tooltip from './tooltip';

describe('ESPTooltip', () => {
  it('should render successfully with default export', () => {
    render(
      <ThemeProvider>
        <Tooltip placement="bottom" title={'Tooltip'}>
          <button>hover me</button>
        </Tooltip>
      </ThemeProvider>
    );
    expect(screen.getByText('hover me')).toBeInTheDocument();
  });

  it('should render successfully', () => {
    render(
      <ThemeProvider>
        <ESPTooltip placement="bottom" title={'Tooltip'}>
          <button>hover me</button>
        </ESPTooltip>
      </ThemeProvider>
    );
    expect(screen.getByText('hover me')).toBeInTheDocument();
  });

  it('should render successfully', () => {
    render(
      <ThemeProvider>
        <ESPTooltip
          placement="bottom"
          title={'Looks good to me'}
          slotProps={{
            tooltip: {
              className: 'sidebar-tooltip',
            },
            arrow: {
              className: 'arrow-tooltip',
            },
          }}
        >
          <button>hover me</button>
        </ESPTooltip>
      </ThemeProvider>
    );

    expect(screen.getByText('hover me')).toBeInTheDocument();
  });
});
