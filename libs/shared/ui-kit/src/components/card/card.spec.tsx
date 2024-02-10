import ThemeProvider from '@ui-kit/contexts/theme-context';
import AddIcon from '@mui/icons-material/Add';
import { render } from '@testing-library/react';
import { theme } from '@ui-kit/theme';

import { ESPButton } from '../button';
import { ESPTypography } from '../typography';
import ESPCard from './card';
import { ESPCard as Card } from './card';

describe('Card', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPCard />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <Card />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should render title successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPCard title={<ESPTypography variant="h4">Vacation</ESPTypography>} />
      </ThemeProvider>
    );

    expect(baseElement.textContent).toContain('Vacation');
  });

  it('should render correct if have props headerActions', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPCard
          title={<ESPTypography variant="h4">Vacation</ESPTypography>}
          headerActions={<AddIcon />}
        />
      </ThemeProvider>
    );

    const addIcon = baseElement.querySelector('svg[data-testid="AddIcon"]');

    expect(addIcon).toBeInTheDocument();
  });

  it('should render correct if have props actions', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ESPCard
          title={<ESPTypography variant="h4">Vacation</ESPTypography>}
          headerActions={<AddIcon />}
          actions={<ESPButton color="primary">Click</ESPButton>}
        />
      </ThemeProvider>
    );

    const button = getByRole('button', { name: 'Click' });

    expect(button).toBeInTheDocument();
    expect(button.innerHTML).toContain('Click');
  });

  it('should render correct if have children', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPCard
          title={<ESPTypography variant="h4">Vacation</ESPTypography>}
          headerActions={<AddIcon />}
          actions={<ESPButton color="primary">Click</ESPButton>}
          children={<>Card unit test</>}
        />
      </ThemeProvider>
    );

    const contentDiv = baseElement.querySelector('.MuiCardContent-root');

    expect(contentDiv?.innerHTML).toContain('Card unit test');
  });
});
