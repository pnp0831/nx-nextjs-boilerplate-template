import './index.scss';

import FullHeightBox from '@esp/components/full-height-box';
import ESPPageTitle from '@esp/components/page-title';
import { APP_ROUTE } from '@esp/constants';
import { ESPTab } from '@ui-kit/components/tab';
import React from 'react';

import AttendanceLog from './(main-components)/attendance-log';
import TimePolicy from './(main-components)/time-policy';

export const metadata = {
  title: 'Administrative Tools',
};

const tabs_content = [
  {
    label: 'Time Policy',
    children: <TimePolicy />,
  },
  {
    label: 'Attendance Log',
    children: <AttendanceLog />,
  },
];

const AdministrativeToolsPage = () => {
  return (
    <>
      <ESPPageTitle
        title="Time Management"
        breadcrumbs={[
          {
            name: 'Time Management',
            href: APP_ROUTE.TIME_MANAGEMENT,
          },
          {
            name: 'Administrative Tools',
          },
        ]}
      />

      <FullHeightBox>
        <ESPTab tabs={tabs_content} className="esp-administrative-tools-tab" />
      </FullHeightBox>
    </>
  );
};

export default AdministrativeToolsPage;
