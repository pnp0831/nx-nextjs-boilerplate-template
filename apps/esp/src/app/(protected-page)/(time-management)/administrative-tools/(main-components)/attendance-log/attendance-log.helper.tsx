import { getAttendanceLogs } from '@esp/apis/time-management';
import { IAttendanceLogs } from '@esp/components/timesheet-calendar';
import { stringifyLoadOptions } from '@esp/utils/helper';
import { useQuery } from '@tanstack/react-query';
import { ILoadOptions } from '@ui-kit/components/table/type';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';

import { IParamsOptions, IUseGetAttendanceLogs } from './attendance-log.type';

const MAX_ATTENDANCE_LOGS_PER_MONTH = 31;
export const DATE_FORMAT = 'DD/MM/YYYY';

export function useGetAttendanceLogs({
  tableName,
  loadOptions,
  forceInitCall,
}: IUseGetAttendanceLogs) {
  const enabled = forceInitCall
    ? true
    : loadOptions.employeeIds?.length && loadOptions.startDate && loadOptions.endDate;

  const { data, isFetching } = useQuery({
    queryKey: [tableName, loadOptions],
    queryFn: () => {
      const params = stringifyLoadOptions(loadOptions);
      return getAttendanceLogs(params);
    },
    enabled: !!enabled,
    keepPreviousData: true,
  });

  const dataResponse = useMemo(() => data?.data, [data?.data]);
  const isFetchingData = useMemo(() => isFetching, [isFetching]);

  return {
    data: dataResponse,
    loading: isFetchingData,
  };
}

export function useGetTimesheetALogs(loadOptions: ILoadOptions & IParamsOptions) {
  const { data } = useGetAttendanceLogs({
    tableName: 'timesheet-calendar',
    loadOptions: {
      take: MAX_ATTENDANCE_LOGS_PER_MONTH,
      ...loadOptions,
    },
  });

  const timesheetALogs = useMemo(() => {
    if (data) {
      return data.data.reduce(
        (acc: IAttendanceLogs, val) => ({
          ...acc,
          [dayjs(val.firstCheckIn).format(DATE_FORMAT)]: {
            start: val.firstCheckIn ? dayjs(val.firstCheckIn).format('HH:mm') : '?',
            end: val.lastCheckOut ? dayjs(val.lastCheckOut).format('HH:mm') : '?',
            remark: val.remark,
          },
        }),
        {}
      );
    }
    return {};
  }, [data]);

  return {
    timesheetALogs,
  };
}

export const formatStartDate = (startDate: string | Dayjs) => {
  return dayjs(startDate).startOf('d').toISOString();
};

export const formatEndDate = (endDate: string | Dayjs) => {
  return dayjs(endDate).endOf('d').toISOString();
};
