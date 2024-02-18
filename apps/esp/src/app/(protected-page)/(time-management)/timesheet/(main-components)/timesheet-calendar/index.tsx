'use client';

import {
  getEmployeeIds,
  useGetUnits,
} from '@esp/components/organizations-select/organizations-select.helper';
import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import { ESPTimesheetCalendar, Event } from '@esp/components/timesheet-calendar';
import { InfoBox, SkeletonLoading } from '@esp/components/timesheet-calendar/components';
import { DATE_FORMAT, MAXIMUM_TAKE_RECORD } from '@esp/constants';
import { ModalType, useImportExportNotifier } from '@esp/contexts/import-export-notifier-context';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ESPButton } from '@ui-kit/components/button';
import { ESPMenu } from '@ui-kit/components/menu';
import { ILoadOptions } from '@ui-kit/components/table/type';
import { ESPTooltip } from '@ui-kit/components/tooltip';
import { ESPTypography } from '@ui-kit/components/typography';
import dayjs, { Dayjs } from 'dayjs';
import loUniq from 'lodash/uniq';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useGetTimesheetALogs } from '../../../administrative-tools/(main-components)/attendance-log/attendance-log.helper';
import { useGetTimePolicies } from '../../../administrative-tools/(main-components)/time-policy/time-policy.helper';
import {
  formatDateBasedOnStatementDate,
  getWorkingDatesInMonth,
  useDataSourceForTimesheet,
  useGetLatestSyncTimeLog,
} from '../../timesheet-helper';
import {
  IDataSourceViewDetail,
  IParamsOptions,
  ITimesheetFormData,
  TOnSubmitCallbackId,
} from '../../type';
import LogTimeModal from '../log-time-modal';
import { IDataLogTimeProps, TasksOption } from '../log-time-modal/log-time-modal.type';
import TimesheetCalendarError from './components/timesheet-calendar.error';
import { TaskStatus } from './components/timesheet-calendar.status';
import ViewDetailLogTimeModal from './components/view-detail-log-time-modal';

const TimesheetCalendarWrapper = memo(
  ({
    formValue,
    onFilterTimesheet,
  }: {
    formValue: ITimesheetFormData;
    onFilterTimesheet: (date?: Dayjs) => void;
  }) => {
    //TODO: create regions for hooks and constants

    const [loadOptions, setLoadOptions] = useState<ILoadOptions & IParamsOptions>({});

    const { optionUnits } = useGetUnits();
    const { timesheetALogs } = useGetTimesheetALogs(loadOptions);
    const { data: timePolicies } = useGetTimePolicies();

    const { data: syncTimeLog } = useGetLatestSyncTimeLog(formValue?.units?.value as string);

    const latestSyncTimeLogDescription = useMemo(() => {
      if (typeof syncTimeLog === 'undefined' || !syncTimeLog) {
        return;
      }

      const latestDesc = `(Last sync PMA: ${dayjs(syncTimeLog).format(`HH[h]mm - DD/MMM/YYYY`)})`;

      return latestDesc;
    }, [syncTimeLog]);

    const formatStatementDate = useMemo(() => {
      return dayjs(formatDateBasedOnStatementDate(timePolicies?.statementDate as number));
    }, [timePolicies?.statementDate]);

    const parseFilter = useCallback(
      (data: ITimesheetFormData) => {
        const { startDate, endDate, units } = data;
        const employeeIds = loUniq(
          getEmployeeIds([units] as IOrganizationUnitOptions[], optionUnits)
        );

        const result = {
          startDate,
          endDate,
          employeeIds,
        };

        setLoadOptions(result);
      },
      [optionUnits]
    );

    useEffect(() => {
      parseFilter(formValue);
    }, [formValue, parseFilter]);

    const theme = useTheme();
    const [openLogTimeModal, setOpenLogTimeModal] = useState<boolean | Partial<IDataLogTimeProps>>(
      false
    );

    const [dataSource, setDataSource] = useState<IDataSourceViewDetail | null>();

    const { openModalByType } = useImportExportNotifier();

    const onDateChange = useCallback(
      (date: Dayjs) => {
        onFilterTimesheet(date);
      },
      [onFilterTimesheet]
    );

    const {
      taskInfo,
      dataSource: rawDataSource,
      isLoading,
      onAddOrEditTimeLog,
      isError,
      refetch,
    } = useDataSourceForTimesheet({
      loadOptions: {
        take: MAXIMUM_TAKE_RECORD,
        skip: 0,
        requireTotalCount: true,
        ...loadOptions,
      },
      format: DATE_FORMAT,
    });

    const LIST_ITEM_SETTINGS = useMemo(() => {
      return [
        {
          label: 'Import Time Log',
          onClick: () => {
            openModalByType(ModalType.TIME_LOG_IMPORT);
          },
        },
        {
          label: 'Export Time Log',
          onClick: () => {
            openModalByType(ModalType.TIME_LOG_EXPORT, {
              ...formValue,
              employeeIds: formValue.units ? [formValue.units] : [],
            });
          },
        },
      ];
    }, [formValue, openModalByType]);

    const onAdd = useCallback(
      (event: Event, datePicker: Dayjs) => {
        const { taskId } = event;

        const selectedTask: Partial<TasksOption> = {
          taskCode: taskInfo[taskId].taskCode,
          taskName: taskInfo[taskId].taskName,
          value: taskId,
        };

        setOpenLogTimeModal({ selectedTask, datePicker });
      },
      [taskInfo]
    );

    const onView = useCallback(
      (event: Event, datePicker: Dayjs) => {
        const { data: dataDetail, taskId } = event;

        const selectedTask: Partial<TasksOption> = {
          taskCode: taskInfo[taskId].taskCode,
          taskName: taskInfo[taskId].taskName,
          value: taskId,
          status: taskInfo[taskId].status,
        };

        setDataSource({
          data: dataDetail[datePicker.format('DD/MM/YYYY')].rawData,
          selectedTask,
          datePicker,
        });
      },
      [taskInfo]
    );

    const logTimeElement = useMemo(() => {
      return (
        <ESPButton
          color="secondary"
          sx={{
            color: theme.palette.primary.main,
            boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
            background: 'white',
          }}
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenLogTimeModal((open) => !open);
          }}
        >
          Log Time
        </ESPButton>
      );
    }, [theme.palette.primary.main]);

    const settingElement = useMemo(() => {
      return (
        <ESPMenu
          colorButton="secondary"
          styleButton={{
            color: theme.palette.black.main,
            backgroundColor: theme.palette.gray_light.main,
            boxShadow: '0px 1px 0px 0px #ECECEE',
          }}
          startIcon={<SettingsIcon />}
          listContent={LIST_ITEM_SETTINGS}
        />
      );
    }, [LIST_ITEM_SETTINGS, theme.palette.black.main, theme.palette.gray_light.main]);

    const lackingData = rawDataSource?.[rawDataSource.length - 1]?.data || {};

    const configs = useMemo(() => {
      const finishedHours = rawDataSource[rawDataSource.length - 1]?.totalLogged || 0;
      let requiredHours = 0;
      const HOUR_PER_DAY = 8;

      if (loadOptions.startDate) {
        const workingDates = getWorkingDatesInMonth(dayjs(loadOptions.startDate));

        requiredHours = workingDates * HOUR_PER_DAY;
      }

      return {
        required: (
          <Box className="esp-configs-wrapper" component="span">
            <SkeletonLoading loading={isLoading}>{requiredHours}</SkeletonLoading>
          </Box>
        ),
        finished: (
          <Box className="esp-configs-wrapper" component="span">
            <SkeletonLoading loading={isLoading}>{finishedHours}</SkeletonLoading>
          </Box>
        ),
      };
    }, [rawDataSource, loadOptions.startDate, isLoading]);

    const currentDate = useMemo(() => {
      return dayjs(formValue.startDate);
    }, [formValue.startDate]);

    if (isError) {
      return <TimesheetCalendarError refetch={refetch} />;
    }

    return (
      <>
        {openLogTimeModal && (
          <LogTimeModal
            employeeId={formValue.units?.value as string}
            data={openLogTimeModal as IDataLogTimeProps}
            openLogTimeModal={!!openLogTimeModal}
            setOpenLogTimeModal={setOpenLogTimeModal}
            onSubmitCallback={onAddOrEditTimeLog}
            showCheckbox={
              typeof openLogTimeModal !== 'object' ||
              (typeof openLogTimeModal === 'object' && !openLogTimeModal.id)
            }
          />
        )}

        <ViewDetailLogTimeModal
          dataSource={dataSource}
          setDataSource={setDataSource}
          setOpenLogTimeModal={setOpenLogTimeModal}
          onSubmitCallback={onAddOrEditTimeLog as TOnSubmitCallbackId}
        />

        <ESPTimesheetCalendar
          latestSyncText={latestSyncTimeLogDescription}
          currentDate={currentDate}
          onAdd={onAdd}
          onView={onView}
          onDateChange={onDateChange}
          employeeName={formValue.units?.label}
          logTimeElement={logTimeElement}
          settingElement={settingElement}
          events={rawDataSource}
          attendanceLogs={timesheetALogs}
          configs={configs}
          lackingData={lackingData}
          statementDate={formatStatementDate}
          timesheetInfo={
            <Box sx={{ display: 'grid', gridTemplateColumns: '4fr 1fr 1fr' }}>
              <ESPTypography variant="bold_s">Item</ESPTypography>

              <ESPTooltip
                title="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took"
                placement="bottom-end"
                textAlign="left"
              >
                <ESPTypography variant="bold_s" textAlign="center">
                  OT
                </ESPTypography>
              </ESPTooltip>
              <ESPTypography variant="bold_s" textAlign="center">
                Logged
              </ESPTypography>
            </Box>
          }
          timesheetInfoData={(event) => {
            const taskInfomation = taskInfo[event.taskId] || {};

            return (
              <InfoBox className="esp-timesheet-info-box">
                <Box display="flex" alignItems="center">
                  {!event.isSubtotal && <TaskStatus status={taskInfomation.status} />}
                  <ESPTypography
                    variant={event.isSubtotal ? 'bold_m' : 'regular_s'}
                    marginRight="0.25rem"
                    className="task-code"
                  >
                    {event.name || `[${taskInfomation.taskCode}] -`}
                  </ESPTypography>
                  <ESPTypography variant="regular_s" className="task-name">
                    {taskInfomation.taskName}
                  </ESPTypography>
                </Box>
                <ESPTypography
                  variant={event.isSubtotal ? 'bold_m' : 'regular_s'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {event.overtimeLogged ?? 0}
                </ESPTypography>

                <ESPTypography
                  variant={event.isSubtotal ? 'bold_m' : 'regular_s'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {event.totalLogged}
                </ESPTypography>
              </InfoBox>
            );
          }}
          loading={isLoading}
        />
      </>
    );
  }
);

TimesheetCalendarWrapper.displayName = 'TimesheetCalendarWrapper';

export default TimesheetCalendarWrapper;
