import ThemeProvider from '@ui-kit/contexts/theme-context';
import { fireEvent, render, screen } from '@testing-library/react';

import { ESPPopover } from '.';
import ESPPopoverComponent from './popover';

describe('Popover', () => {
  it('should render successfully', () => {
    render(
      <ThemeProvider>
        <ESPPopover popoverContent={'Looks good to me'}>
          <button>button</button>
        </ESPPopover>
      </ThemeProvider>
    );
    expect(screen.getByText('button')).toBeInTheDocument();
  });

  it('should render successfully', () => {
    const onClickMock = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <ThemeProvider>
        <ESPPopoverComponent
          popoverContent={'Looks good to me'}
          onClick={onClickMock}
          onOpenChange={onOpenChange}
        >
          <button>click me</button>
        </ESPPopoverComponent>
      </ThemeProvider>
    );
    expect(screen.getByText('click me')).toBeInTheDocument();

    fireEvent.click(screen.getByText('click me'));

    expect(onClickMock).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalled();

    expect(screen.getByText('Looks good to me')).toBeInTheDocument();
  });

  it('should trigger onClick func in children', () => {
    const onClick = jest.fn();

    render(
      <ThemeProvider>
        <ESPPopover popoverContent={'Looks good to me'}>
          <button onClick={onClick}>button</button>
        </ESPPopover>
      </ThemeProvider>
    );
    const button = screen.getByText('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toBeCalledTimes(1);
  });
});
