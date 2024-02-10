'use client';

import Breadcrumbs, { BreadcrumbsProps } from '@mui/material/Breadcrumbs';
import { styled } from '@mui/material/styles';

export const BreadcrumbsComponent = styled(Breadcrumbs)<BreadcrumbsProps>(({ theme }) => {
  return {
    '.MuiBreadcrumbs-ol': {
      '.MuiBreadcrumbs-separator': {
        color: theme.palette.primary.main,
        ...theme.typography.bold_s,
        margin: '0.255rem 0.25rem 0 0.25rem',
      },
      '.MuiBreadcrumbs-li': {
        '&:not(:last-child) a': {
          ...theme.typography.bold_s,
          color: theme.palette.primary.main,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },

        '&:last-child': {
          marginTop: '0.25rem',
          p: {
            color: theme.palette.black_muted.main,
          },
        },
      },
    },
  };
});
