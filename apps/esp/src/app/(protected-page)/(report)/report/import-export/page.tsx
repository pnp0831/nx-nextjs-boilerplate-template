import FullHeightBox from '@esp/components/full-height-box';
import ESPPageTitle from '@esp/components/page-title';
import { APP_ROUTE, IDefaultPageProps } from '@esp/constants';
import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

import TabComponent from './(main-components)/tab';

export const metadata = {
  title: 'Import & Export',
};

const ImportExportPage = ({ searchParams }: IDefaultPageProps) => {
  const { tab } = searchParams || {};

  const defaultTab = { import: 0, export: 1 }[tab as string];

  if (typeof defaultTab === 'undefined') {
    redirect(APP_ROUTE.IMPORT, RedirectType.replace);
  }

  return (
    <>
      <ESPPageTitle
        title="Import & Export"
        breadcrumbs={[
          {
            name: 'Report',
            href: APP_ROUTE.REPORT,
          },
          {
            name: 'Import & Export',
          },
        ]}
      />

      <FullHeightBox>
        <TabComponent defaultTab={defaultTab} />
      </FullHeightBox>
    </>
  );
};

export default ImportExportPage;
