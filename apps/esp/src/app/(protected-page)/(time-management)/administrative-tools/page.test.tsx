import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { render } from '@testing-library/react';

import AdministrativeToolsPage from './page';

describe('AdministrativeToolsPage', () => {
  it('should render content successfully', () => {
    const { baseElement, getByText } = render(
      <ContextNeededWrapper>
        <AdministrativeToolsPage />
      </ContextNeededWrapper>
    );

    expect(baseElement).not.toBeNull();
    expect(getByText('Time Policy')).toBeInTheDocument();
    expect(getByText('Attendance Log')).toBeInTheDocument();
  });
});
