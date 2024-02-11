import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Paper, { PaperProps } from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import MUITableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { ESPTypography } from '@ui-kit/components/typography';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Fragment, memo, ReactNode, useState } from 'react';

import styles from '../timesheet-calendar.module.scss';

export const PaperComponent = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'minWidth' && prop !== 'error',
})<PaperProps & { minWidth: string; error?: boolean }>(({ minWidth = '25rem', error }) => {
  return {
    position: 'relative',
    height: 'calc(100vh - 13.375rem)',
    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
    '&:after': {
      content: "''",
      ...(error
        ? {
            display: 'grid',
            placeItems: 'center',
          }
        : {
            display: 'block',
            width: `calc(${minWidth} + 2rem)`,
            background: '#f6f6f9',
            height: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            zIndex: 0,
          }),
    },
  };
});

export const TableContainer = styled(MUITableContainer, {
  shouldForwardProp: (prop) => prop !== 'minWidth',
})<{ minWidth: string }>(({ minWidth }) => ({
  padding: 0,
  height: 'calc(100% - 4.125rem)',

  '&::-webkit-scrollbar-track': {
    marginLeft: `calc(${minWidth} + 2rem)`,
    marginTop: '6rem',
  },
}));

export const InfoBox = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '4fr 1fr 1fr',
}));

export const HeaderBox = styled(Box)(({ minWidth }) => ({
  gridTemplateColumns: `calc(${minWidth} + 2rem) auto`,
}));

export const SkeletonLoading = ({
  loading,
  children,
}: {
  children?: string | number | ReactNode;
  loading: boolean | undefined;
}) => {
  if (loading) {
    return <Skeleton variant="text" className={styles.skeleton} />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment>{children}</Fragment>;
};

export const RowCollapsed = memo(
  ({
    loading,
    datesInMonth,
    objCurrentDate,
  }: {
    loading: boolean | undefined;
    objCurrentDate: { month: number; year: number };
    datesInMonth: number[];
  }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <>
        <TableRow tabIndex={-1} className={styles.tableRowBody}>
          <TableCell
            className={clsx(
              styles.tableCellSticky,
              styles.bgGrayLight,
              styles.tableCellGroup,
              { [styles.expandedCell]: expanded },
              { [styles.notExpandedCell]: !expanded }
            )}
          >
            <InfoBox>
              <Box display="flex" alignItems="center">
                <ESPTypography variant="regular_s" marginRight="0.25rem">
                  {expanded ? 'Timeoff' : 'Holiday'}
                </ESPTypography>
              </Box>
              <ESPTypography variant="regular_s" margin="auto">
                {/* <SkeletonLoading loading={loading}>0</SkeletonLoading> */}
              </ESPTypography>
              <ESPTypography variant="regular_s" margin="auto">
                <SkeletonLoading loading={loading}>0</SkeletonLoading>
              </ESPTypography>
            </InfoBox>
          </TableCell>

          {datesInMonth.map((date) => {
            const currentDateInCalendar = dayjs()
              .month(objCurrentDate.month)
              .year(objCurrentDate.year)
              .date(date);

            const isWeekend = [6, 0].includes(currentDateInCalendar.day());

            const isToday = currentDateInCalendar.isSame(dayjs(), 'day');

            return (
              <TableCell
                className={clsx(styles.tableCellCalendar, {
                  [styles.tableCellWeekend]: isWeekend,
                  [styles.tableCellRemoveHover]: true,
                  [styles.isTableCellToday]: isToday,
                })}
                key={date}
              >
                <Box
                  className={clsx(styles.tableCellContent, {
                    [styles.tableCellContentWeekend]: isWeekend,
                    [styles.tableCellContentWeekend]: isWeekend,
                  })}
                >
                  <Box>
                    <ESPTypography variant="regular_s">
                      <SkeletonLoading loading={loading}>-</SkeletonLoading>
                    </ESPTypography>
                    {/* <Box className={styles.tableCellContentAction}>
                      <AddCircleOutlinedIcon />
                    </Box> */}
                  </Box>
                </Box>
              </TableCell>
            );
          })}
        </TableRow>

        <TableRow
          tabIndex={-1}
          className={clsx(styles.tableRowBody, styles.cell, {
            [styles.cellExpaned]: expanded,
          })}
        >
          <TableCell
            className={clsx(
              styles.tableCellSticky,
              styles.bgGrayLight,
              styles.tableCellGroup,
              { [styles.expandedCell]: !expanded },
              { [styles.notExpandedCell]: expanded },
              styles.rowHasArrowExpanded
            )}
          >
            <InfoBox>
              <Box display="flex" alignItems="center">
                <ESPTypography variant="regular_s" marginRight="0.25rem">
                  Leave Request
                </ESPTypography>
              </Box>
              <ESPTypography variant="regular_s" margin="auto">
                {/* <SkeletonLoading loading={loading}>0</SkeletonLoading> */}
              </ESPTypography>

              <ESPTypography variant="regular_s" margin="auto">
                <SkeletonLoading loading={loading}>0</SkeletonLoading>
              </ESPTypography>

              <Box
                className={clsx(styles.timesheetArrowIcon, {
                  [styles.timesheetArrowIconExpanded]: expanded,
                })}
                onClick={() => setExpanded((expanded) => !expanded)}
              >
                <KeyboardArrowUpIcon />
              </Box>
            </InfoBox>
          </TableCell>

          {datesInMonth.map((date) => {
            const currentDateInCalendar = dayjs()
              .month(objCurrentDate.month)
              .year(objCurrentDate.year)
              .date(date);

            const isWeekend = [6, 0].includes(currentDateInCalendar.day());

            const isToday = currentDateInCalendar.isSame(dayjs(), 'day');

            return (
              <TableCell
                className={clsx(styles.tableCellCalendar, styles.cellFull, {
                  [styles.tableCellWeekend]: isWeekend,
                  [styles.cell0]: expanded,
                  [styles.isTableCellToday]: isToday,
                  [styles.tableCellRemoveHover]: true,
                })}
                key={date}
              >
                <Box
                  className={clsx(styles.tableCellContent, {
                    [styles.tableCellContentWeekend]: isWeekend,
                  })}
                >
                  <Box>
                    <ESPTypography variant="regular_s" margin="auto">
                      <SkeletonLoading loading={loading}>-</SkeletonLoading>
                    </ESPTypography>

                    {/* <Box className={styles.tableCellContentAction}>
                      <AddCircleOutlinedIcon />
                    </Box> */}
                  </Box>
                </Box>
              </TableCell>
            );
          })}
        </TableRow>
      </>
    );
  }
);

RowCollapsed.displayName = 'RowCollapsed';

export const FakeEventLoading = memo(
  ({
    objCurrentDate,
    datesInMonth,
  }: {
    objCurrentDate: { month: number; year: number };
    datesInMonth: number[];
  }) => {
    return (
      <>
        {Array.from(Array(5)).map((item, index) => (
          <TableRow tabIndex={-1} className={styles.tableRowBody} key={index}>
            <TableCell className={clsx(styles.tableCellSticky, styles.bgGrayLight)}>
              <InfoBox>
                <ESPTypography variant="regular_s">
                  <SkeletonLoading loading />
                </ESPTypography>
                <ESPTypography variant="regular_s" margin="auto">
                  <SkeletonLoading loading />
                </ESPTypography>
                <ESPTypography variant="regular_s" margin="auto">
                  <SkeletonLoading loading />
                </ESPTypography>
              </InfoBox>
            </TableCell>
            {datesInMonth.map((date, dateIndex) => {
              const currentDateInCalendar = dayjs()
                .month(objCurrentDate.month)
                .year(objCurrentDate.year)
                .date(date);
              const isWeekend = [6, 0].includes(currentDateInCalendar.day());
              const isToday = currentDateInCalendar.isSame(dayjs(), 'day');
              return (
                <TableCell
                  className={clsx(styles.tableCellCalendar, {
                    [styles.tableCellWeekend]: isWeekend,
                    [styles.isTableCellToday]: isToday,
                    [styles.tableCellRemoveHover]: true,
                    [styles.isSubtotalCell]: index === 4,
                  })}
                  key={`${date} - ${dateIndex}`}
                >
                  <Box
                    className={clsx(styles.tableCellContent, {
                      [styles.tableCellContentWeekend]: isWeekend,
                    })}
                  >
                    <Box>
                      <ESPTypography variant="regular_s">
                        <SkeletonLoading loading />
                      </ESPTypography>
                    </Box>
                  </Box>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </>
    );
  }
);

FakeEventLoading.displayName = 'FakeEventLoading';
