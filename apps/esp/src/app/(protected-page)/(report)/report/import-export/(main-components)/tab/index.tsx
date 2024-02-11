'use client';

import { APP_ROUTE, IMPORT_EXPORT_ICON_PARAM } from '@esp/constants';
import {
  FLOW_STATUS,
  LOADING_STATUS,
  ModalType,
  useImportExportNotifier,
} from '@esp/contexts/import-export-notifier-context';
import { ESPTab } from '@ui-kit/components/tab';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { memo, useEffect } from 'react';

import ExportHistory from '../export-history';
import ImportHistory from '../import-history';

const tabs_content = [
  {
    label: 'Import History',
    children: <ImportHistory />,
  },
  {
    label: 'Export History',
    children: <ExportHistory />,
  },
];

const TabComponent = memo(({ defaultTab = 0 }: { defaultTab: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getImportExportIconParam = searchParams.get(IMPORT_EXPORT_ICON_PARAM);

  const { dataModal, removeModalById } = useImportExportNotifier();

  useEffect(() => {
    if (getImportExportIconParam !== 'true') {
      Object.values(dataModal).filter((i) => {
        if (
          i.status === LOADING_STATUS.SUCCESS_LOADING ||
          (i.type === ModalType.TIME_LOG_EXPORT && i.status === LOADING_STATUS.ERROR_LOADING) ||
          (i.type === ModalType.TIME_LOG_IMPORT &&
            i.status === LOADING_STATUS.ERROR_LOADING &&
            i.flowStatus !== FLOW_STATUS.WARNING)
        ) {
          removeModalById(i.modalId);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getImportExportIconParam]);

  const onChangeTab = (tab: number) => {
    router.replace(tab === 0 ? APP_ROUTE.IMPORT : APP_ROUTE.EXPORT);
  };

  return (
    <ESPTab
      tabs={tabs_content}
      defaultTab={defaultTab}
      onChangeTab={onChangeTab}
      className="esp-import-export-history-tab"
    />
  );
});

TabComponent.displayName = 'TabComponent';

export default TabComponent;
