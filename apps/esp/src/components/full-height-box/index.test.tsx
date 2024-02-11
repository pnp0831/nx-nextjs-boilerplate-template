import { render } from '@testing-library/react';
import ThemeProvider from '@ui-kit/contexts/theme-context';

import FullHeightBox from '.';

describe('FullHeightBox', () => {
  it('should render component default props successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <FullHeightBox>children</FullHeightBox>
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render component with custom props successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <FullHeightBox background="red">children</FullHeightBox>
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
