import { render } from '@testing-library/react';
import ThemeProvider from '@ui-kit/contexts/theme-context/index';

import Content from '.';

describe('Admin header layout', () => {
  it('should render default successfully', () => {
    render(
      <ThemeProvider>
        <Content>testing</Content>
      </ThemeProvider>
    );
  });
});
