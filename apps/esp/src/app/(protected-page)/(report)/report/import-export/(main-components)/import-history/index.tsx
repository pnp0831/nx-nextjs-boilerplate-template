'use client';

import '../import-export-history.scss';

import { getLinkDownloadFile, TResponseGetLinkDownload } from '@esp/apis/file-management';
import { IDataProgressInformation } from '@esp/apis/progress-management';
import useNotify from '@esp/hooks/useNotify';
import { triggerDownload } from '@esp/utils/helper';
import Box from '@mui/material/Box';
import { ESPTable } from '@ui-kit/components/table';
import { CondOperator, ILoadOptions } from '@ui-kit/components/table/type';
import { ESPTag } from '@ui-kit/components/tag';
import { ESPTypography } from '@ui-kit/components/typography';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import { useGetProgressInformation } from '../export-history/export-history.helper';

const exportTableName = 'export-table';

const ImportHistory = () => {
  const { notifyError } = useNotify();

  const [loadOptions, setLoadOptions] = useState<ILoadOptions & { [key: string]: unknown }>({});

  const { data: exportData, loading: exportLoading } = useGetProgressInformation({
    exportTableName,
    loadOptions,
  });

  const onLoadOptionsChange = useCallback(
    (newLoadOptions: ILoadOptions, extendParams?: { [key: string]: unknown }) => {
      setLoadOptions((loadOption) => {
        return {
          ...loadOption,
          ...newLoadOptions,
          ...extendParams,
          filter: ['type', CondOperator.CONTAINS, 'import'],
        };
      });
    },
    []
  );

  const handleDownloadFile = async (fileName: string) => {
    try {
      const data: TResponseGetLinkDownload = await getLinkDownloadFile(fileName);
      if (!data.data) {
        return;
      }

      const formatLinkDownload = data.data as string;
      triggerDownload(formatLinkDownload);
    } catch (err) {
      notifyError(err);
    }
  };

  const columnsExportTable = useMemo(() => {
    return [
      {
        id: 'fileName',
        label: 'File Name',
        minWidth: 300,
        sortable: true,
        resizable: true,
        render: (row: IDataProgressInformation) => {
          return <ESPTypography variant="bold_m">{row.fileName}</ESPTypography>;
        },
      },
      {
        id: 'requestedTime',
        label: 'Submitted Time',
        minWidth: 200,
        sortable: true,
        resizable: true,
        render: (row: IDataProgressInformation) => {
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
        render: (row: IDataProgressInformation) => {
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
        minWidth: 200,
        sortable: true,
        resizable: true,
        render: (row: IDataProgressInformation) => {
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
        render: (row: IDataProgressInformation) => {
          const downloadButton = (
            <a
              onClick={() => {
                handleDownloadFile(row.fileName);
              }}
              className="esp-import-export-history-download"
            >
              Download
            </a>
          );

          let component = null;

          switch (row.status) {
            case 'Success':
              component = component = (
                <Box display="flex" alignItems="center">
                  <ESPTypography className="esp-import-export-history-result" variant="regular_m">
                    {row.result}
                  </ESPTypography>
                </Box>
              );

              break;
            case 'Error':
              component = (
                <Box display="flex">
                  <ESPTypography variant="regular_m" className="esp-import-export-history-result">
                    {row.result}
                  </ESPTypography>
                  <ESPTypography variant="regular_m">{downloadButton}</ESPTypography>
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
  }, []);

  return (
    <Box>
      <ESPTable
        totalItems={exportData?.totalCount as number}
        data={(exportData?.data || []) as IDataProgressInformation[]}
        onLoadOptionsChange={onLoadOptionsChange}
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
    </Box>
  );
};

export default ImportHistory;
