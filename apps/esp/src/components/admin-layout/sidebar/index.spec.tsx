import { mockCommonUser } from '@esp/__mocks__/data-mock';
import { dataLayerPush } from '@esp/components/google-analyze';
import { useAppContext } from '@esp/contexts/app-context';
import useAuth from '@esp/hooks/useAuth';
import { act, fireEvent, render } from '@testing-library/react';
import ThemeProvider from '@ui-kit/contexts/theme-context';
import { useSession } from 'next-auth/react';

import Sidebar from '.';

jest.mock('next-auth/react');

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(),
  useRouter: jest.fn().mockReturnValue({
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useServerInsertedHTML: jest.fn(),
}));

(useSession as jest.Mock).mockReturnValue({
  data: null,
  status: 'unauthenticated',
});

jest.mock('@esp/hooks/useAuth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      signIn: jest.fn(),
      signOut: jest.fn(),
      user: mockCommonUser,
    })),
  };
});

jest.mock('@esp/components/google-analyze', () => ({
  dataLayerPush: jest.fn(),
}));

const mockSidebarOpen = jest.fn();

jest.mock('@esp/contexts/app-context', () => ({
  useAppContext: jest.fn(() => ({
    sidebarOpen: mockSidebarOpen,
  })),
}));

describe('Admin sidebar layout', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <Sidebar />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should trigger handleClick avatar successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <Sidebar />
      </ThemeProvider>
    );

    const avatarSidebar = baseElement.querySelector('.sidebar--avatar');
    fireEvent.click(avatarSidebar);

    expect(dataLayerPush).toHaveBeenCalledWith({ event_name: 'click_avatar' });
  });

  it('should trigger logOut func successfully', async () => {
    const mockSignOut = jest.fn();

    useAuth.mockReturnValue({
      signIn: jest.fn(),
      signOut: mockSignOut,
      user: {
        id: '1',
        name: 'Mock User',
        role: 'Mock Role',
        perms: [],
      },
    });

    const { getByRole } = render(
      <ThemeProvider>
        <Sidebar />
      </ThemeProvider>
    );

    const { signOut } = useAuth();

    const settingButton = getByRole('button', { name: 'Setting' });
    fireEvent.click(settingButton);

    const logoutButton = getByRole('button', { name: 'Logout' });
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('should trigger handleClick item in sidebar without children successfully', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <Sidebar />
      </ThemeProvider>
    );

    const dashboardButton = getByRole('button', { name: 'Dashboard' });
    fireEvent.click(dashboardButton);

    const activeClass = document.getElementsByClassName('active-sidebar-item');
    expect(activeClass[0]).toBeInTheDocument();
  });

  it('should trigger handleClick item in sidebar with children successfully', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <Sidebar />
      </ThemeProvider>
    );

    const timeManagement = getByRole('button', { name: 'Time Management' });
    fireEvent.click(timeManagement);

    const timesheetButton = getByRole('button', { name: 'Timesheet' });
    fireEvent.click(timesheetButton);

    const activeClass = document.getElementsByClassName('active-sidebar-item');
    expect(activeClass[0]).toBeInTheDocument();

    fireEvent.click(timeManagement);
  });

  it('should trigger handleClick item in sidebar setting with children successfully', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <Sidebar />
      </ThemeProvider>
    );

    const timeManagement = getByRole('button', { name: 'Setting' });
    fireEvent.click(timeManagement);

    const activeClass = document.getElementsByClassName('active-sidebar-item');
    expect(activeClass[0]).toBeInTheDocument();

    fireEvent.click(timeManagement);
  });

  it('should trigger sidebarOpen successfully', () => {
    useAppContext.mockReturnValue(false);

    const { baseElement } = render(
      <ThemeProvider>
        <Sidebar />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
  });
});
