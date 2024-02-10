import { BreadcrumbsProps } from '@mui/material/Breadcrumbs';

export interface Breadcrumb {
  href?: string;
  name: string;
}

export interface ESPBreadcrumbsProps extends BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  component?: unknown;
}
