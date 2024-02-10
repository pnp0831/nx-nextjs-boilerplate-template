import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render } from '@testing-library/react';

import ESPMenu from './menu';
import { ESPMenu as ESPMenuComponent } from './';
import { theme } from '@ui-kit/theme';

const LIST_ITEM_SETTINGS = [
  {
    label: 'Import Time Log',
  },
  {
    label: 'Export Time Log',
  },
];

describe('ESPMenu', () => {
  it('should render successfully with default props', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPMenuComponent colorButton="secondary" listContent={LIST_ITEM_SETTINGS} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully with custom text and className', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ESPMenu
          colorButton="secondary"
          styleButton={{
            color: theme.palette.black.main,
            backgroundColor: theme.palette.gray_light.main,
            boxShadow: '0px 1px 0px 0px #ECECEE',
          }}
          startIcon={<div>startIcon</div>}
          listContent={LIST_ITEM_SETTINGS}
        />
      </ThemeProvider>
    );
    expect(getByText('startIcon')).toBeInTheDocument();
  });
});
