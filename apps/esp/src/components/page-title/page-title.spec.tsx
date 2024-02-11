import { render } from '@testing-library/react';
import ThemeProvider from '@ui-kit/contexts/theme-context/index';

import ESPPageTitle from '.';

const BREADCRUMBS = [
  {
    name: 'Time Management',
    href: '/style-guide',
  },
  {
    name: 'Timesheet',
  },
];

describe('Autocomplete', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPPageTitle breadcrumbs={BREADCRUMBS} title="Title" />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully with breadcrumbs', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ESPPageTitle breadcrumbs={BREADCRUMBS} title="Page Title" />
      </ThemeProvider>
    );

    const breadcrumbEl = getByRole('navigation');

    expect(breadcrumbEl).toBeInTheDocument();
    expect(breadcrumbEl).toHaveTextContent(BREADCRUMBS[1].name);
  });

  it('should render successfully with title', () => {
    const title = 'Page title';
    const { getByRole } = render(
      <ThemeProvider>
        <ESPPageTitle breadcrumbs={BREADCRUMBS} title={title} />
      </ThemeProvider>
    );

    const typoEl = getByRole('heading');

    expect(typoEl).toBeInTheDocument();
    expect(typoEl).toHaveTextContent(title);
  });

  it('should have marginTop styling without props actions', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ESPPageTitle breadcrumbs={BREADCRUMBS} title="Page Title" data-testid="page-title" />
      </ThemeProvider>
    );

    const typoEl = getByRole('heading');

    expect(typoEl).toBeInTheDocument();
    expect(typoEl).toHaveStyle('marginTop: 0.5rem');
  });

  it('should remove marginTop with props actions', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ESPPageTitle
          breadcrumbs={BREADCRUMBS}
          title="Page Title"
          actions={<>Hi</>}
          data-testid="page-title"
        />
      </ThemeProvider>
    );

    const typoEl = getByRole('heading');

    expect(typoEl).toBeInTheDocument();
    expect(typoEl).toHaveStyle('marginTop: 0');
  });
});
