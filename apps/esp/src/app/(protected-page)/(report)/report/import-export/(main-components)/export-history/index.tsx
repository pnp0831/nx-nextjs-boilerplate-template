'use client';

import { getLinkDownloadFile, TResponseGetLinkDownload } from '@esp/apis/file-management';
import { IExportProgressItems } from '@esp/apis/progress-management';
import ESPConfirmModal from '@esp/components/confirm-modal';
import { MAXIMUM_TAKE_RECORD } from '@esp/constants';
import useNotify from '@esp/hooks/useNotify';
import { triggerDownload } from '@esp/utils/helper';
import Box from '@mui/material/Box';
import { ESPTable } from '@ui-kit/components/table';
import { CondOperator } from '@ui-kit/components/table/type';
import { ESPTag } from '@ui-kit/components/tag';
import { ESPTypography } from '@ui-kit/components/typography';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import {
  formatExportProgress,
  renderDownloadButton,
  useGetProgressInformation,
} from './export-history.helper';

const exportTableName = 'export-table';

const LOAD_OPTIONS = {
  filter: ['type', CondOperator.CONTAINS, 'export'],
  take: MAXIMUM_TAKE_RECORD,
  skip: 0,
  sort: [
    {
      selector: 'requestedTime',
      desc: true,
    },
  ],
};

const ExportHistory = () => {
  const { notifyError } = useNotify();
  const [popUpBlockerWarning, setPopUpBlockerWarning] = useState<boolean>(false);

  const { data: exportData, loading: exportLoading } = useGetProgressInformation({
    exportTableName,
    loadOptions: LOAD_OPTIONS,
    transformData: (data) => {
      if (data?.data) {
        const { data: groupedData, totalCount } = formatExportProgress(data.data);

        return {
          data: groupedData,
          totalCount,
        };
      }

      return {
        data: [],
        totalCount: 0,
      };
    },
  });

  const handleDownloadFiles = useCallback(
    async (fileNames: string[]) => {
      for (const fileName of fileNames) {
        try {
          const data: TResponseGetLinkDownload = await getLinkDownloadFile(fileName);
          if (!data.data) {
            return;
          }
          const formatLinkDownload = data.data as string;
          const triggerredDownload = triggerDownload(formatLinkDownload);
          if (triggerredDownload === null) {
            setPopUpBlockerWarning(true);
          }
        } catch (err) {
          notifyError(err);
        }
      }
    },
    [notifyError]
  );

  const columnsExportTable = useMemo(() => {
    return [
      {
        id: 'fileName',
        label: 'File Name',
        minWidth: 300,
        sortable: true,
        resizable: true,
        render: (row: IExportProgressItems) => {
          return <ESPTypography variant="bold_m">{row.fileName}</ESPTypography>;
        },
      },
      {
        id: 'type',
        label: 'Report Type',
        minWidth: 200,
        resizable: true,
        sortable: true,
      },
      {
        id: 'requestedTime',
        label: 'Requested Time',
        minWidth: 200,
        sortable: true,
        resizable: true,
        render: (row: IExportProgressItems) => {
          let component = null;
          component = row.requestedTime && (
            <ESPTypography variant="regular_m">
              {dayjs(row.requestedTime).format('HH:mm - DD MMM YYYY')}
            </ESPTypography>
          );
          return component;
        },
      },
      {
        id: 'finishedTime',
        label: 'Finished Time',
        minWidth: 200,
        resizable: true,
        sortable: true,
        render: (row: IExportProgressItems) => {
          let component = null;
          component = row.finishedTime && (
            <ESPTypography variant="regular_m">
              {dayjs(row.finishedTime).format('HH:mm - DD MMM YYYY')}
            </ESPTypography>
          );
          return component;
        },
      },
      {
        id: 'status',
        label: 'Status',
        sortable: true,
        minWidth: 200,
        resizable: true,
        render: (row: IExportProgressItems) => {
          let component = null;
          switch (row.status) {
            case 'Success':
              component = (
                <ESPTag label="Success" color="success" className="esp-import-export-history-tag" />
              );
              break;
            case 'Error':
              component = <ESPTag label="Error" className="esp-import-export-history-tag-error" />;
              break;
            case 'In Progress':
              component = <ESPTag label="In Progress" className="esp-import-export-history-tag" />;
              break;
            default:
              break;
          }
          return component;
        },
      },
      {
        id: 'result',
        label: 'Results',
        minWidth: 800,
        resizable: true,
        render: (row: IExportProgressItems) => {
          const downloadButton = renderDownloadButton(row, handleDownloadFiles);

          let component = null;
          switch (row.status) {
            case 'Success':
              component = (
                <Box display="flex">
                  <Box display="flex">
                    {row.fileNamesForDownload === undefined ? (
                      <ESPTypography
                        variant="regular_m"
                        className="esp-import-export-history-result"
                      >
                        {row.result}
                      </ESPTypography>
                    ) : null}
                    <ESPTypography variant="regular_m">{downloadButton}</ESPTypography>
                  </Box>
                </Box>
              );

              break;
            case 'Error':
              component = (
                <Box display="flex">
                  <ESPTypography
                    variant="regular_m"
                    className="esp-import-export-history-result-error"
                    display={'inline'}
                  >
                    {row.result}
                  </ESPTypography>
                </Box>
              );
              break;
            default:
              break;
          }
          return component;
        },
      },
    ];
  }, [handleDownloadFiles]);

  return (
    <Box>
      <ESPTable
        totalItems={exportData?.totalCount as number}
        data={(exportData?.data || []) as IExportProgressItems[]}
        columns={columnsExportTable}
        loading={exportLoading}
        defaultSort={{
          field: 'requestedTime',
          order: 'desc',
        }}
      />
      <ESPTypography variant="regular_m" className="esp-import-export-history-notes">
        Notes: All records are only visible for 30 days
      </ESPTypography>
      <ESPConfirmModal
        open={popUpBlockerWarning}
        showCancelBtn={false}
        title="Reminder"
        onCancel={() => setPopUpBlockerWarning(false)}
        onClose={() => setPopUpBlockerWarning(false)}
        onConfirm={() => setPopUpBlockerWarning(false)}
        subTitle="Pop-up Blocker is enabled! Please add this site to your exception list."
        confirmText="OK"
      />
    </Box>
  );
};

export default ExportHistory;
