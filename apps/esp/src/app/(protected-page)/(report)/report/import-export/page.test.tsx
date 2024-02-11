import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { render } from '@testing-library/react';

import AdministrativeToolsPage from './page';

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
  useRouter: jest.fn().mockReturnValue({
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  redirect: jest.fn(),
  useServerInsertedHTML: jest.fn(),
}));

describe('AdministrativeToolsPage', () => {
  it('should render content successfully', () => {
    const { baseElement, getByText } = render(
      <ContextNeededWrapper>
        <AdministrativeToolsPage searchParams={{}} />
      </ContextNeededWrapper>
    );

    expect(baseElement).not.toBeNull();
    expect(getByText('Report')).toBeInTheDocument();
    expect(getByText('Import History')).toBeInTheDocument();
    expect(getByText('Export History')).toBeInTheDocument();
  });
});
