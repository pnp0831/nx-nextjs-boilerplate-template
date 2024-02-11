import './index.scss';

import Link from '@esp/libs/next-link';
import ESPBreadcrumbs from '@ui-kit/components/breadcrumb/breadcrumb';
import { Breadcrumb } from '@ui-kit/components/breadcrumb/type';
import { ESPCard } from '@ui-kit/components/card';
import { ESPTypography } from '@ui-kit/components/typography';
import React, { ReactNode } from 'react';

interface ESPPageTitle {
  title: ReactNode;
  actions?: ReactNode;
  breadcrumbs: Breadcrumb[];
}

const ESPPageTitle = ({ title, actions, breadcrumbs }: ESPPageTitle) => {
  return (
    <ESPCard sx={{ mb: '0.75rem' }}>
      <div className="page-content">
        <div className="page-content__title">
          {breadcrumbs && <ESPBreadcrumbs breadcrumbs={breadcrumbs} component={Link} />}
          <ESPTypography variant="h3" sx={!actions ? { marginTop: '0.5rem' } : {}}>
            {title}
          </ESPTypography>
        </div>
        <div className="page-content__action">{actions}</div>
      </div>
    </ESPCard>
  );
};

export default ESPPageTitle;
