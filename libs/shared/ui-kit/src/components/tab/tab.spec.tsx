import ThemeProvider from '@ui-kit/contexts/theme-context';
import { fireEvent, render } from '@testing-library/react';

import ESPTab from './tab';
import { ESPTab as Tab } from './tab';

const tabs_content = [
  {
    label: 'Tab 1',
  },
  {
    label: 'Tab 2',
    children: 'Content tab 2',
  },
];

describe('Tabs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPTab tabs={tabs_content} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <Tab />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should trigger onChange', () => {
    const { baseElement, getByRole } = render(
      <ThemeProvider>
        <ESPTab tabs={tabs_content} />
      </ThemeProvider>
    );

    const tab = getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(tab);

    expect(baseElement.textContent).toContain(tabs_content[1].children);
  });

  it('should render no data if no children', () => {
    const { getByRole, getByAltText } = render(
      <ThemeProvider>
        <ESPTab tabs={tabs_content} />
      </ThemeProvider>
    );

    const tab = getByRole('tab', { name: 'Tab 1' });
    fireEvent.click(tab);

    const uploadedImage = getByAltText('no-data');
    expect(uploadedImage).toBeInTheDocument();
  });

  it('should trigger onChangeTab func', () => {
    const onChangeTab = jest.fn();

    const { getByRole } = render(
      <ThemeProvider>
        <ESPTab tabs={tabs_content} onChangeTab={onChangeTab} />
      </ThemeProvider>
    );

    const tab = getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(tab);

    expect(onChangeTab).toBeCalledTimes(1);
  });
});
