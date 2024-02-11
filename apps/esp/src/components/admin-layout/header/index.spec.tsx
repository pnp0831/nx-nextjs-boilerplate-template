import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { fireEvent, render } from '@testing-library/react';
import * as lodash from 'lodash';

import Header from '.';

const mockToggleSidebar = jest.fn();
const mockToggleSidebarMobile = jest.fn();

jest.mock('@mui/material/useMediaQuery', () => jest.fn());

jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: jest.fn(() => ({
    breakpoints: {
      up: jest.fn((breakpoint) => breakpoint === 'md'),
    },
    palette: {
      mandate: {
        main: '',
      },
      success: {
        main: '',
      },
      black: {
        main: '',
      },
      error: {
        main: '',
      },
      white: {
        main: '',
      },
      common: {
        white: '',
      },
      gray_light: {
        main: '',
      },
      black_muted: {
        main: '',
      },
    },
  })),
}));

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  usePathname: () => '/example-pathname',
  useServerInsertedHTML: jest.fn(),
}));

const lowerCaseMock = jest
  .spyOn(lodash, 'lowerCase')
  .mockImplementation((value?: string) => (value as string).toLowerCase());

jest.mock('@esp/contexts/app-context', () => ({
  useAppContext: jest.fn(() => ({
    toggleSidebar: mockToggleSidebar,
    toggleSidebarMobile: mockToggleSidebarMobile,
  })),
}));

describe('Admin header layout', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ContextNeededWrapper>
        <Header />
      </ContextNeededWrapper>
    );

    expect(baseElement).toBeTruthy();
    lowerCaseMock.mockRestore();
  });

  it('should trigger toggle menu with breakpoint >= md successfully', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    const { getByTestId } = render(
      <ContextNeededWrapper>
        <Header />
      </ContextNeededWrapper>
    );

    const menuOpenButton = getByTestId('MenuOpenIcon');
    fireEvent.click(menuOpenButton);

    expect(mockToggleSidebar).toBeCalled();

    lowerCaseMock.mockRestore();
  });

  it('should trigger toggle menu with breakpoint < md successfully', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    const { getByTestId } = render(
      <ContextNeededWrapper>
        <Header />
      </ContextNeededWrapper>
    );

    const menuOpenButton = getByTestId('MenuOpenIcon');
    fireEvent.click(menuOpenButton);

    expect(mockToggleSidebarMobile).toBeCalled();

    lowerCaseMock.mockRestore();
  });
});
