import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { act, render } from '@testing-library/react';

import RootLayout from './layout';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn().mockResolvedValue(null), // You can provide a mock session object if needed
}));

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: () => '/',
  useSearchParams: jest.fn(),
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

describe('Root Layout', () => {
  it('should render content successfully', async () => {
    await act(async () => {
      const { baseElement } = render(
        await RootLayout({
          children: <div>children</div>,
        }),
        { wrapper: ContextNeededWrapper }
      );

      expect(baseElement).not.toBeNull();
    });
  });
});
