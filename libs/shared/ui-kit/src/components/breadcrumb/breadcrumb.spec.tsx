import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';

import { ESPBreadcrumbs as ESPBreadcrumbsComponent } from '.';
import ESPBreadcrumbs from './breadcrumb';

describe('ESPBreadcrumbs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPBreadcrumbs
          breadcrumbs={[
            {
              name: 'Service Management',
            },
          ]}
        />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(screen.getByText('Service Management')).toBeInTheDocument();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPBreadcrumbsComponent
          breadcrumbs={[
            {
              name: 'Dashboard',
            },
            {
              name: 'Service Management',
              href: '/service-management',
            },
          ]}
        />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Service Management')).toBeInTheDocument();
  });
});
