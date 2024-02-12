import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render } from '@testing-library/react';

import { ESPLoading } from './loading';

describe('Modal', () => {
  it('should render loading successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPLoading />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render img loading button successfully', () => {
    const loading = true;
    const { getByAltText } = render(
      <ThemeProvider>
        <ESPLoading loading={loading} />
      </ThemeProvider>
    );

    const img = getByAltText('loading');
    expect(img).toBeInTheDocument();
  });
});
