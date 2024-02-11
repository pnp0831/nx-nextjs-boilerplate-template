'use client';

import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import { ESPButton } from '@ui-kit/components/button';
import { ESPTooltip } from '@ui-kit/components/tooltip';
import { ESPTypography } from '@ui-kit/components/typography';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import updateLocale from 'dayjs/plugin/updateLocale';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  FakeEventLoading,
  HeaderBox,
  PaperComponent,
  RowCollapsed,
  TableContainer,
} from './components';
import styles from './timesheet-calendar.module.scss';
import { ESPTimesheetCalendarProps, IPropertyAttendanceLog } from './type';

//Rem
const COLUMN_WIDTH = 3;
const PADDING_LEFT_RIGHT_EACH_COLUMN = 0.6;
const DEFAULT_REM_TO_PX = 16;

dayjs.extend(isSameOrBefore);

const DEFAULT_ATTENDANCE_LOG: IPropertyAttendanceLog = {
  start: '?',
  end: '?',
  remark: 'Missing Attendance',
};

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

export const ESPTimesheetCalendar = memo(
  ({
    onDateChange,
    onView,
    onAdd,
    format = 'DD/MM/YYYY',
    events = [],
    currentDate: initDate,
    // for timesheet
    extendHour = true,
    attendanceLogs = {},
    configs = {
      required: null,
      finished: null,
    },
    timesheetInfo,
    timesheetInfoData = () => <div />,
    minWidth = '24.125rem',
    logTimeElement,
    settingElement,
    employeeName,
    loading,
    lackingData = {},
    statementDate,
    latestSyncText = '',
  }: ESPTimesheetCalendarProps) => {
    const theme = useTheme();
    const refTable = useRef<HTMLTableElement | null>(null);

    const [currentDate, setDate] = useState(initDate || dayjs());

    const handleChangeDate = useCallback(
      (date: Dayjs) => {
        if (typeof onDateChange === 'function') {
          onDateChange(date);
        }

        setDate(date);
      },
      [setDate, onDateChange]
    );

    const objCurrentDate = useMemo(
      () => ({
        month: currentDate.month(),
        year: currentDate.year(),
      }),
      [currentDate]
    );

    const handleScrollToDate = useCallback((scrollToTargetDate: Dayjs) => {
      const { current: table } = refTable;
      if (table && typeof table.scrollTo === 'function') {
        const isTargetDateSameMonthWithCurrentDate = scrollToTargetDate.isSame(dayjs(), 'M');
        const column = isTargetDateSameMonthWithCurrentDate ? dayjs().date() : 1;

        let extendPadding = DEFAULT_REM_TO_PX * PADDING_LEFT_RIGHT_EACH_COLUMN * column;

        if (column === 1) {
          extendPadding = 0;
        }

        const scrollLeft = COLUMN_WIDTH * DEFAULT_REM_TO_PX * (column - 1) + extendPadding;

        table.scrollTo({
          top: 0,
          left: scrollLeft,
        });
      }
    }, []);

    const handleClickToday = useCallback(
      (currentDate?: Dayjs) => {
        // update current date
        if (!currentDate) {
          return handleChangeDate(dayjs());
        }

        return handleScrollToDate(currentDate || dayjs());
      },
      [handleChangeDate, handleScrollToDate]
    );

    useEffect(() => {
      handleClickToday(currentDate);
    }, [currentDate, handleClickToday]);

    const toolbars = useMemo(() => {
      const activePrevBtn = true;
      const activeNextBtn = true;
      return (
        <Box className={styles.timesheetToolbars}>
          <Box className={styles.timesheetLogTimeButton}>{logTimeElement}</Box>
          <ESPButton size="medium" color="secondary" onClick={() => handleClickToday()}>
            Today
          </ESPButton>
          <Box className={styles.timesheetToolbarsWrapperArrow}>
            <Box
              onClick={() => {
                if (activePrevBtn) {
                  handleChangeDate(currentDate.subtract(1, 'month').startOf('M'));
                }
              }}
              className={clsx(styles.timesheetToolbarsArrow, {
                [styles.timesheetToolbarsArrowActive]: activePrevBtn,
              })}
            >
              <ArrowBackIosIcon fontSize="small" />
            </Box>
            <Box
              className={clsx(styles.timesheetToolbarsArrow, {
                [styles.timesheetToolbarsArrowActive]: activeNextBtn,
              })}
              onClick={() => {
                if (activeNextBtn) {
                  handleChangeDate(currentDate.add(1, 'month').startOf('M'));
                }
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </Box>
          </Box>
          <Box className={styles.timesheetSetting}>{settingElement}</Box>
        </Box>
      );
    }, [logTimeElement, currentDate, handleChangeDate, handleClickToday, settingElement]);

    const getNameOfWeekDay = (date: number) =>
      ({
        0: 'Sun',
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat',
      }[date]);

    const datesInMonth = useMemo(
      () => [...Array(dayjs(currentDate).daysInMonth()).keys()].map((i) => i + 1),
      [currentDate]
    );

    const getClassNameByLogged = useCallback((logged: number | string) => {
      if (Number(logged) >= 8) {
        return styles.greenColor;
      }

      return styles.productsColor;
    }, []);

    const getClassNameByAttendance = useCallback((error: boolean) => {
      if (error) {
        return styles.productsColor;
      }

      return '';
    }, []);

    const checkCanAddTimeLog = useCallback((statementDate: Dayjs, currentDateInCalendar: Dayjs) => {
      const defaultTime = dayjs().startOf('day');

      const isSameMonth = currentDateInCalendar.isSame(statementDate, 'month');
      const currentMonthIsAfterStatement = currentDateInCalendar.isAfter(statementDate, 'month');

      const conditionCanAddTimeLog =
        (statementDate.isAfter(defaultTime, 'day') || statementDate.isSame(defaultTime, 'day')) &&
        isSameMonth;

      if (currentMonthIsAfterStatement) {
        return true;
      }

      if (conditionCanAddTimeLog) {
        return true;
      }

      return !statementDate.add(1, 'day').isAfter(currentDateInCalendar, 'day');
    }, []);

    return (
      <PaperComponent minWidth={minWidth} className={styles.timesheetContainer}>
        <HeaderBox className={styles.timesheetHeader} minWidth={minWidth}>
          <Box className={clsx(styles.timesheetHeaderInfo, styles.bgGrayLight)} minWidth={minWidth}>
            <Box>
              <ESPTypography variant="paragraph" fontWeight={600}>
                {employeeName}
              </ESPTypography>
            </Box>
          </Box>

          <Box className={styles.timesheetHeaderToolbars}>
            <Box className={styles.timesheetHeaderToolbarDate}>
              <ESPTypography variant="paragraph" fontWeight={600}>
                {currentDate.format('MMMM YYYY')}
              </ESPTypography>
              <ESPTypography
                margin={'0.5rem'}
                variant="regular_s"
                color={theme.palette.black_muted.main}
              >
                {latestSyncText}
              </ESPTypography>
            </Box>
            {toolbars}
          </Box>
        </HeaderBox>
        <TableContainer
          className={clsx(styles.timesheetTable, 'scrollbar-trigger-visibility')}
          ref={refTable}
          minWidth={minWidth}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={clsx(styles.tableCellSticky, styles.bgGrayLight)}>
                  <Box>
                    <Box
                      className={clsx(styles.tableCellInfo, {
                        [styles.tableCellInfoNotExtendHour]: !extendHour,
                      })}
                    >
                      <ESPTypography variant="regular_m" display="flex">
                        Period:
                        <ESPTypography variant="regular_m" marginLeft="0.25rem" component="span">
                          {dayjs(currentDate).startOf('M').format('DD/MMM')}
                          {' - '}
                          {dayjs(currentDate).endOf('M').format('DD/MMM')}
                        </ESPTypography>
                      </ESPTypography>

                      {extendHour && (
                        <Box>
                          <ESPTypography variant="regular_m" display="flex" alignItems="center">
                            Finished:
                            <ESPTypography
                              variant="regular_m"
                              marginLeft="0.25rem"
                              component="span"
                              display="flex"
                              alignItems="center"
                            >
                              {configs.finished}
                              <ESPTypography variant="regular_m" margin="0.25rem" component="span">
                                /
                              </ESPTypography>
                              {configs.required}
                              <ESPTypography
                                variant="regular_m"
                                marginLeft="0.25rem"
                                component="span"
                              >
                                hours
                              </ESPTypography>
                            </ESPTypography>
                          </ESPTypography>
                        </Box>
                      )}
                    </Box>

                    <Box minWidth={minWidth}>{timesheetInfo}</Box>
                  </Box>
                </TableCell>

                {datesInMonth.map((date, index) => {
                  const currentDateInCalendar = dayjs()
                    .month(objCurrentDate.month)
                    .year(objCurrentDate.year)
                    .date(date);

                  const currentDateInCalendarFormat = currentDateInCalendar.format(format);

                  const isWeekend = [0, 6].includes(currentDateInCalendar.day());

                  // eslint-disable-next-line prefer-const
                  let { start, end, remark } =
                    attendanceLogs[currentDateInCalendarFormat] || DEFAULT_ATTENDANCE_LOG;

                  if (isWeekend && start === '?' && end === '?') {
                    start = '-';
                    end = '-';
                  }

                  const isCurrentDateSameOfBefore = currentDateInCalendar.isSameOrBefore(dayjs());

                  const { logged } = lackingData[currentDateInCalendarFormat] || {
                    logged: 0,
                    overrtime: 0,
                  };

                  const isToday = currentDateInCalendar.isSame(dayjs(), 'day');

                  const shouldDisplayLogged = isCurrentDateSameOfBefore && Number(logged) < 8;

                  const messageDisplayLogged =
                    Number(logged) === 0
                      ? 'No work has yet been logged'
                      : 'The total time logged is under 8 hours';

                  const shoduleDisplayIconWarning =
                    !isWeekend &&
                    ((isCurrentDateSameOfBefore && remark !== 'No Remark') || shouldDisplayLogged);

                  const classNameStart = getClassNameByAttendance(
                    [
                      'Missing Attendance',
                      'Missing Check in',
                      'Late in',
                      'Late in & Early out',
                    ].includes(remark) &&
                      isCurrentDateSameOfBefore &&
                      !isWeekend
                  );

                  const classNameEnd = getClassNameByAttendance(
                    [
                      'Missing Attendance',
                      'Missing Check-out',
                      'Early out',
                      'Late in & Early out',
                    ].includes(remark) &&
                      isCurrentDateSameOfBefore &&
                      !isWeekend
                  );

                  return (
                    <TableCell
                      key={`${currentDateInCalendar.date()} - ${index}`}
                      className={clsx(styles.tableCellSticky, {
                        [styles.tableCellWeekend]: isWeekend,
                        [styles.tableCellExtendHour]: extendHour,
                        [styles.tableCellExtendHourWeekend]: extendHour && isWeekend,
                        [styles.isTableHeaderToday]: isToday,
                      })}
                      sx={{ textAlign: 'center', padding: 0 }}
                    >
                      <Box
                        className={clsx({
                          [styles.tableCellContentNotWeekend]: !isWeekend,
                          [styles.tableCellContentNotWeekendNotExtendHour]:
                            !isWeekend && !extendHour,
                          [styles.tableCellContentWeekend]: isWeekend,
                          [styles.tableCellContentNotExtendHour]: !extendHour,
                          [styles.tableCellContentNotExtendHour]: !extendHour,
                          [styles.tableCellContentWarning]: shoduleDisplayIconWarning && !isWeekend,
                        })}
                      >
                        <ESPTypography variant="regular_s" position="relative">
                          {getNameOfWeekDay(currentDateInCalendar.day())}
                        </ESPTypography>

                        {shoduleDisplayIconWarning && (
                          <ESPTooltip
                            title={
                              <Box component="ul" className={styles.contentWrapper}>
                                {shouldDisplayLogged && (
                                  <ESPTypography variant="regular_s" component="li">
                                    {messageDisplayLogged}
                                  </ESPTypography>
                                )}

                                {remark !== 'No Remark' && (
                                  <ESPTypography variant="regular_s" component="li">
                                    {remark}
                                  </ESPTypography>
                                )}
                              </Box>
                            }
                            placement="bottom-end"
                            textAlign="left"
                            className={styles.iconWarning}
                          >
                            <ErrorOutlineIcon />
                          </ESPTooltip>
                        )}

                        <ESPTypography variant="bold_l" position="relative" top="-0.125rem">
                          {currentDateInCalendar.date()}
                        </ESPTypography>
                        {extendHour && (
                          <>
                            <ESPTypography
                              variant="regular_xs"
                              component="p"
                              className={clsx(classNameStart)}
                              sx={{
                                color: theme.palette.black_muted.main,
                                margin: '0.125rem 0',
                              }}
                            >
                              {isCurrentDateSameOfBefore ? start : '-'}
                            </ESPTypography>

                            <ESPTypography
                              className={clsx(classNameEnd)}
                              sx={{
                                color: theme.palette.black_muted.main,
                                marginBottom: '0.125rem',
                              }}
                              variant="regular_xs"
                              component="p"
                            >
                              {isCurrentDateSameOfBefore ? end : '-'}
                            </ESPTypography>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              <RowCollapsed
                objCurrentDate={objCurrentDate}
                datesInMonth={datesInMonth}
                loading={loading}
              />

              {loading ? (
                <FakeEventLoading objCurrentDate={objCurrentDate} datesInMonth={datesInMonth} />
              ) : (
                events.map((event, eventIndex) => {
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={`${event.name} - ${eventIndex}`}
                      className={styles.tableRowBody}
                    >
                      <TableCell className={clsx(styles.tableCellSticky, styles.bgGrayLight)}>
                        {timesheetInfoData(event)}
                      </TableCell>

                      {datesInMonth.map((date, dateIndex) => {
                        const currentDateInCalendar = dayjs()
                          .month(objCurrentDate.month)
                          .year(objCurrentDate.year)
                          .date(date);

                        const currentEvent = event.data[currentDateInCalendar.format(format)] || {};

                        const isWeekend = [6, 0].includes(currentDateInCalendar.day());
                        const isToday = currentDateInCalendar.isSame(dayjs(), 'day');

                        const shouldDislayZero =
                          currentDateInCalendar.isSameOrBefore(dayjs()) &&
                          !isWeekend &&
                          event.isSubtotal;

                        let { logged = '-' } = currentEvent;

                        if (shouldDislayZero && logged === '-') {
                          logged = 0;
                        }

                        const classNameLogged = shouldDislayZero
                          ? getClassNameByLogged(logged)
                          : '';

                        const shouldAddTimeLog = checkCanAddTimeLog(
                          statementDate as Dayjs,
                          currentDateInCalendar
                        );

                        return (
                          <TableCell
                            className={clsx(styles.tableCellCalendar, {
                              [styles.tableCellWeekend]: isWeekend,
                              [styles.tableCellRemoveHover]:
                                event.isSubtotal || (!shouldAddTimeLog && logged === '-'),
                              [styles.isSubtotalCell]: event.isSubtotal,
                              [styles.isTableCellToday]: isToday,
                            })}
                            key={`${event.name} - ${date} - ${eventIndex} -${dateIndex}`}
                            onClick={() => {
                              if (event.isSubtotal || (!shouldAddTimeLog && logged === '-')) {
                                return;
                              }

                              if (logged !== '-') {
                                return onView?.(event, currentDateInCalendar.startOf('day'));
                              }

                              return onAdd?.(event, currentDateInCalendar);
                            }}
                          >
                            <Box
                              className={clsx(styles.tableCellContent, {
                                [styles.tableCellContentWeekend]: isWeekend,
                              })}
                            >
                              <Box>
                                <ESPTypography
                                  variant={event.isSubtotal ? 'bold_m' : 'regular_s'}
                                  className={classNameLogged}
                                >
                                  {logged}
                                </ESPTypography>
                                {!event.isSubtotal && (
                                  <Box className={styles.tableCellContentAction}>
                                    {logged !== '-' ? (
                                      <RemoveRedEyeIcon />
                                    ) : logged === '-' && shouldAddTimeLog ? (
                                      <AddCircleOutlinedIcon />
                                    ) : null}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </PaperComponent>
    );
  }
);

ESPTimesheetCalendar.displayName = 'ESPTimesheetCalendar';
