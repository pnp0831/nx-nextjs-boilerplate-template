import { getTasksByTaskIds, getUserTasksList, ITask } from '@esp/apis/task-management';
import { getLatestSyncTimeLog, getTimeLogs, IGetTimeLog } from '@esp/apis/time-management';
import { Event, IEventData } from '@esp/components/timesheet-calendar';
import { queryClient } from '@esp/contexts/react-query-context';
import { stringifyLoadOptions } from '@esp/utils/helper';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import groupBy from 'lodash/groupBy';
import loUniq from 'lodash/uniq';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  IDataLogTimeProps,
  IOnSubmitParams,
} from './(main-components)/log-time-modal/log-time-modal.type';
import { IUseGetTimeLogs, TOnSubmitCallback, TOnSubmitReason } from './type';

export const MIN_LOGGED_PER_DAY = 8;

export const formatToHoursAndMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = remainingMinutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:00`;
};

export const addDurationToDateTime = (
  dateTimeString: string,
  durationString: string,
  timeZone: string
) => {
  const dateTime = new Date(dateTimeString);
  const [hours, minutes, seconds] = durationString.split(':').map(Number);

  dateTime.setHours(dateTime.getHours() + hours);
  dateTime.setMinutes(dateTime.getMinutes() + minutes);
  dateTime.setSeconds(dateTime.getSeconds() + seconds);

  const year = dateTime.getFullYear();
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
  const day = dateTime.getDate().toString().padStart(2, '0');
  const hoursFormatted = dateTime.getHours().toString().padStart(2, '0');
  const minutesFormatted = dateTime.getMinutes().toString().padStart(2, '0');
  const secondsFormatted = dateTime.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hoursFormatted}:${minutesFormatted}:${secondsFormatted}${timeZone}`;
};

export const getStartDate = (dateString: string, timeZone: string) => {
  const formattedDate = new Date(dateString);

  formattedDate.setHours(MIN_LOGGED_PER_DAY, 0, 0, 0);

  const year = formattedDate.getFullYear();
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
  const day = formattedDate.getDate().toString().padStart(2, '0');
  const hours = formattedDate.getHours().toString().padStart(2, '0');
  const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
  const seconds = formattedDate.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timeZone}`;
};

export const validateMinumumLogTimeBeforeSubmit = (
  formData: IDataLogTimeProps,
  minimumLogTime: number
) => {
  if (typeof minimumLogTime === 'undefined' || !minimumLogTime) {
    return false;
  }

  const formattedTime = formData.duration.format('HH:mm:ss');

  const formatMinimumLogTime = formatToHoursAndMinutes(minimumLogTime);

  return formattedTime >= formatMinimumLogTime;
};

export const validateMaximumLogTimeBeforeSubmit = (
  formData: IDataLogTimeProps,
  maximumLogTime: number
) => {
  if (typeof maximumLogTime === 'undefined' || !maximumLogTime) {
    return false;
  }

  const formattedTime = formData.duration.format('HH:mm:ss');

  const formatMaximumLogTime = formatToHoursAndMinutes(maximumLogTime);

  return formattedTime <= formatMaximumLogTime;
};

export const customizeLabelInput = (label: string) => {
  const [_taskCode, ...taskNames] = label.split(' ');

  return taskNames.join(' ');
};

export function useGetUserTasksList(employeeId: string) {
  const { data } = useQuery({
    queryKey: ['taskList', employeeId],
    queryFn: () => getUserTasksList(employeeId),
  });

  return {
    data: data?.data,
  };
}

export function formatDateBasedOnStatementDate(date: number) {
  const currentDate = dayjs();
  const formattedDate = `${currentDate.format('MM')}-${date}-${currentDate.format('YYYY')}`;
  return formattedDate;
}

export function getTimeZone() {
  const date = new Date();
  const offsetMinutes = date.getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
  const offsetMinutesRemainder = Math.abs(offsetMinutes % 60);
  const sign = offsetMinutes < 0 ? '+' : '-';

  const formattedTimeZone = `${sign}${String(offsetHours).padStart(2, '0')}:${String(
    offsetMinutesRemainder
  ).padStart(2, '0')}`;

  return formattedTimeZone;
}

export function useDataSourceForTimesheet({ loadOptions, format }: IUseGetTimeLogs) {
  const [taskInfo, setTaskInfo] = useState<{ [taskId: string]: ITask }>({});
  const [dataSource, setDataSource] = useState<Event[]>([]);
  const [hasError, setHasError] = useState(false);

  const enabled = loadOptions.startDate && loadOptions.endDate && loadOptions.employeeIds?.length;

  const queryKey = ['get-time-logs', loadOptions];

  const {
    data: dataGetTimeLogs,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => {
      setHasError(false);
      const params = stringifyLoadOptions(loadOptions);
      return getTimeLogs(params);
    },
    enabled: !!enabled,
  });

  const mutationFn = useCallback(
    ({ data, reason }: { data: IOnSubmitParams; reason: TOnSubmitReason }) => {
      const rawData = [...(dataGetTimeLogs?.data?.data || [])];

      const { id } = data;

      const idx = rawData.findIndex((i) => i.id === id);

      switch (reason) {
        case 'add':
          rawData.push(data);
          break;
        case 'edit':
          if (idx > -1) {
            rawData.splice(idx, 1, data);
          }
          break;
        case 'delete':
          if (idx > -1) {
            rawData.splice(idx, 1);
          }
          break;

        default:
          break;
      }

      return rawData;
    },
    [dataGetTimeLogs?.data?.data]
  );

  const mutation = useMutation({
    // @ts-expect-error: IGNORE
    queryKey,
    mutationFn,
    onSuccess: (data: IOnSubmitParams[]) => {
      queryClient.setQueryData(queryKey, {
        data: {
          data,
        },
      });
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTaskInfoByTaskIds = async (taskIds: string[]) => {
    const taskIdsNotExist = taskIds.filter((taskId) => !Object.keys(taskInfo).includes(taskId));

    if (taskIdsNotExist.length) {
      const params = stringifyLoadOptions({ ids: taskIdsNotExist });

      try {
        const { data } = await getTasksByTaskIds(params);

        const taskInfo = data.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});

        setTaskInfo((oldTask) => ({
          ...oldTask,
          ...taskInfo,
        }));
      } catch {
        setHasError(true);
      }
    }
  };

  const formatRawDataToDataSource = useCallback(
    async (data: IGetTimeLog[]) => {
      const events: Event[] = [];

      const groupByTaskId = groupBy(data, 'taskId');

      Object.entries(groupByTaskId).forEach(([key, value]) => {
        const eventData = value.reduce((acc, cur) => {
          const keyStartDate = dayjs(cur.startDate).format(format);
          const oldData = acc[keyStartDate] || ({} as IEventData);

          const logged = +(Number(oldData?.logged || 0) + minutesToHours(cur.duration));

          const listDetailLoggedTime = oldData?.rawData ? oldData.rawData : [];
          listDetailLoggedTime.push({
            description: cur.description,
            duration: cur.duration,
            employeeId: cur.employeeId,
            endDate: cur.endDate,
            startDate: cur.startDate,
            taskId: cur.taskId,
            id: cur.id,
          });

          return {
            ...acc,
            [keyStartDate]: {
              ...oldData,
              rawData: listDetailLoggedTime,
              logged: formatHours(logged),
            },
          };
        }, {} as IEventData);

        const totalLogged = value.reduce((acc, cur) => acc + cur.duration, 0);

        const event = {
          taskId: key,
          data: eventData,
          totalLogged: formatHours(minutesToHours(totalLogged)),
          overtimeLogged: 0,
        };

        events.push(event);
      });

      const subTotalData: IEventData = {};

      const subTotalEvent = {
        name: 'Subtotal',
        totalLogged: formatHours(
          events.reduce((acc, cur) => Number(acc) + Number(cur.totalLogged || 0), 0)
        ),
        data: subTotalData,
        taskId: '',
        isSubtotal: true,
      };

      events.forEach((item) => {
        for (const date in item.data) {
          const { logged, overrtime } = subTotalData[date] || {
            logged: 0,
            overrtime: 0,
          };

          const totalLogged = formatHours(Number(logged) + Number(item.data[date]?.logged ?? 0));
          const totalOvertime = Number(overrtime) + Number(item.data[date]?.overrtime ?? 0);

          subTotalData[date] = {
            logged: totalLogged,
            overrtime: totalOvertime,
          };
        }
      });

      events.push(subTotalEvent);

      setDataSource(events);
    },
    [format]
  );

  useEffect(() => {
    if (dataGetTimeLogs?.data) {
      const { data } = dataGetTimeLogs.data;

      const taskIds = loUniq(data.map((item) => item.taskId));

      getTaskInfoByTaskIds(taskIds);

      formatRawDataToDataSource(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataGetTimeLogs?.data, formatRawDataToDataSource]);

  const resDataSource = useMemo(() => dataSource, [dataSource]);
  const resTaskInfo = useMemo(() => taskInfo, [taskInfo]);

  const onAddOrEditTimeLog: TOnSubmitCallback = useCallback(
    (data, reason) => {
      mutation.mutate({ data, reason });
    },
    [mutation]
  );

  const handleRefetch = useCallback(() => {
    refetch();
    const { data = [] } = dataGetTimeLogs?.data || {};

    const taskIds = loUniq(data.map((item) => item.taskId));
    getTaskInfoByTaskIds(taskIds);
  }, [dataGetTimeLogs?.data, getTaskInfoByTaskIds, refetch]);

  return {
    taskInfo: resTaskInfo,
    dataSource: resDataSource,
    isLoading,
    onAddOrEditTimeLog,
    isError: isError || hasError,
    refetch: handleRefetch,
  };
}

export const minutesToHours = (minutes: number) => {
  const minutesPerHour = 60;
  const result = minutes / minutesPerHour;

  return result;
};

export const formatHours = (hours: string | number): number => {
  if (Number.isInteger(hours)) {
    return hours as number;
  }

  return +parseFloat(hours as unknown as string).toFixed(2);
};

export const getWorkingDatesInMonth = (date: Dayjs, holidays: string[] = []) => {
  let workingDays = 0;
  const firstDayOfMonth = dayjs(date).startOf('M');
  const lastDayOfMonth = date.endOf('M');

  let currentDate = firstDayOfMonth;

  while (currentDate.isSameOrBefore(lastDayOfMonth)) {
    if (
      ![0, 6].includes(currentDate.day()) &&
      !holidays.includes(currentDate.format('DD/MM/YYYY'))
    ) {
      workingDays++;
    }
    currentDate = currentDate.add(1, 'day');
  }

  return workingDays;
};

export const convertDayJsDurationToMinutes = (duration: Dayjs) => {
  const hours = duration.hour();
  const minutes = duration.minute();
  return hours * 60 + minutes;
};

export const convertNumberToDayjs = (duration: number) => {
  const timeObject = dayjs().startOf('day').add(duration, 'minute');

  return timeObject;
};

export const formatDurationToHourAndMinutes = (duration: number) => {
  const hours = Math.floor(duration / 60);
  const remainingMinutes = duration % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = remainingMinutes.toString().padStart(2, '0');

  return `${formattedHours} hours and ${formattedMinutes} minutes`;
};

export const useGetLatestSyncTimeLog = (employeeId: string) => {
  const queryKey = ['latest-sync-time-log', employeeId];

  const { data } = useQuery({
    queryKey,
    queryFn: () => getLatestSyncTimeLog(employeeId as string),
  });

  return {
    data: data?.data,
  };
};
