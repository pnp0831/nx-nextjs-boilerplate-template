import { ReactQueryClient } from '@esp/contexts/react-query-context';
import { render } from '@testing-library/react';
import ThemeProvider from '@ui-kit/contexts/theme-context';
import * as lodash from 'lodash';
import { useSession } from 'next-auth/react';

import AdminLayout from '.';

jest.mock('next-auth/react');

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: () => '/example-pathname',
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

const lowerCaseMock = jest
  .spyOn(lodash, 'lowerCase')
  .mockImplementation((value?: string) => (value as string).toLowerCase());

describe('Admin layout', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ReactQueryClient>
          <AdminLayout>s</AdminLayout>
        </ReactQueryClient>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    lowerCaseMock.mockRestore();
  });
});
