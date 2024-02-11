import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockCommonUser } from '@esp/__mocks__/data-mock';
import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import RootLayout from './layout';
import DashboardPage from './page';

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(),
  useServerInsertedHTML: jest.fn(),
}));

jest.mock('next-auth/react');

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

describe('Root Layout', () => {
  it('should render content successfully', () => {
    (usePathname as jest.Mock).mockReturnValue('/time-management');

    const { baseElement } = render(
      <ContextNeededWrapper>
        <RootLayout>
          <div>children</div>
        </RootLayout>
      </ContextNeededWrapper>
    );

    expect(baseElement).not.toBeNull();
  });
});

describe('Dashboard', () => {
  it('should render content successfully', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    const { baseElement } = render(<ContextNeededWrapper>{DashboardPage()}</ContextNeededWrapper>);

    expect(baseElement).not.toBeNull();
  });
});
