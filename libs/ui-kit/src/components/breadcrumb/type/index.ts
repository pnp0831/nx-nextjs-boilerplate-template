import { BreadcrumbsProps } from '@mui/material/Breadcrumbs';
import React from 'react';

export interface Breadcrumb {
  href?: string;
  name: string;
}

export interface ESPBreadcrumbsProps extends BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  component?: React.ElementType;
}
