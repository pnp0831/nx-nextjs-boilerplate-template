import {
  getProgressInformation,
  IDataProgressInformation,
  IExportProgressItems,
  TProgresssStatus,
} from '@esp/apis/progress-management';
import { stringifyLoadOptions } from '@esp/utils/helper';
import { useQuery } from '@tanstack/react-query';
import loGroupBy from 'lodash/groupBy';
import { useMemo } from 'react';

import { IUseGetProgressInformation } from './export-history.type';

export function useGetProgressInformation({
  exportTableName,
  loadOptions,
  forceInitCall,
  transformData,
}: IUseGetProgressInformation) {
  const { data, isFetching } = useQuery({
    queryKey: [exportTableName, loadOptions],
    queryFn: () => {
      const params = stringifyLoadOptions(loadOptions);
      return getProgressInformation(params);
    },
    enabled: forceInitCall ? true : Object.keys(loadOptions).length > 0,
    keepPreviousData: true,
  });

  const dataResponse = useMemo(() => {
    if (transformData) {
      return transformData(data?.data);
    }

    return data?.data;
  }, [data?.data, transformData]);
  const isFetchingData = useMemo(() => isFetching, [isFetching]);

  return {
    data: dataResponse,
    loading: isFetchingData,
  };
}

const getProgressStatusByCondition = ({
  isStatusSuccess,
  isStatusError,
  isStatusInProgress,
}: {
  isStatusSuccess: boolean;
  isStatusError: boolean;
  isStatusInProgress: boolean;
}): TProgresssStatus => {
  switch (true) {
    case isStatusInProgress:
      return 'In Progress';
    case isStatusError:
      return 'Error';
    case isStatusSuccess:
      return 'Success';
    default:
      return 'In Progress';
  }
};

export function formatExportProgress(exportProgress: IDataProgressInformation[]): {
  data: IExportProgressItems[];
  totalCount: number;
} {
  const groupByGroupid: {
    [groupId: string]: IDataProgressInformation[];
  } = loGroupBy(exportProgress, 'groupId');

  const result: IExportProgressItems[] = [];

  Object.values(groupByGroupid).forEach((items) => {
    const isStatusSuccess = items.every((i) => i.status === 'Success');
    const isStatusError = items.find((i) => i.status === 'Error');
    const isStatusInProgress = items.some((i) => i.status === 'In Progress');

    const status = getProgressStatusByCondition({
      isStatusSuccess,
      isStatusError: !!isStatusError,
      isStatusInProgress,
    });

    const fileNamesForDownload =
      items.length > 1 ? items.map((prog) => prog.fileName).reverse() : undefined;

    const fileName = items[0]?.fileName.replace(/\([1-9][0-9]*\)/, '');

    const data: IExportProgressItems = {
      ...items[0],
      fileNamesForDownload,
      fileName,
      status,
      result: isStatusError ? isStatusError.result : items[0].result,
    };

    result.push(data);
  });

  return {
    data: result,
    totalCount: Object.values(groupByGroupid).length,
  };
}

export function renderDownloadButton(
  row: IExportProgressItems,
  handleDownloadFiles: (fileNames: string[]) => void
) {
  return row.fileNamesForDownload ? (
    <>
      <a
        onClick={() => {
          handleDownloadFiles(row.fileNamesForDownload as string[]);
        }}
        className="esp-import-export-history-download"
      >
        Download all
      </a>{' '}
      (
      {row.fileNamesForDownload.map((name, index, arr) => (
        <span key={name}>
          <a
            href="#"
            onClick={() => {
              handleDownloadFiles([name]);
            }}
            className="esp-import-export-history-download"
            key={name}
          >
            file-{index + 1}
          </a>
          {index < arr.length - 1 ? ', ' : null}
        </span>
      ))}
      )
    </>
  ) : (
    <a
      onClick={() => {
        handleDownloadFiles([row.fileName]);
      }}
      className="esp-import-export-history-download"
    >
      Download
    </a>
  );
}
