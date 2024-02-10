import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render } from '@testing-library/react';

import ESPNotAvaliable from './not-available';
import { ESPNotAvaliable as ESPNotAvaliableComponent } from './not-available';

describe('ESPNotAvaliable', () => {
  it('should render successfully with default props', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ESPNotAvaliableComponent width={50} height={50} />
      </ThemeProvider>
    );
    expect(getByText('No Data Avaliable')).toBeInTheDocument();
  });

  it('should render successfully with custom text and className', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ESPNotAvaliable width={50} height={50} text="No Data" className="esp-class-name" />
      </ThemeProvider>
    );
    expect(getByText('No Data')).toBeInTheDocument();
  });
});
