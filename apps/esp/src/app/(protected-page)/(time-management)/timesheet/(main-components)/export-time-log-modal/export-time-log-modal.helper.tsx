import dayjs, { Dayjs } from 'dayjs';

import { PeriodOptionData } from './export-time-log-modal.type';

const currentDate = dayjs(new Date());

export const CURRENT_YEAR = 'current_year';
export const CURRENT_MONTH = 'current_month';

export const PERIOD_OPTION: PeriodOptionData = {
  current_month: {
    name: 'current_month',
    label: 'Current month',
    startDate: currentDate.startOf('month'),
    endDate: currentDate,
    checked: false,
  },
  last_month: {
    name: 'last_month',
    label: 'Last month',
    startDate: currentDate.subtract(1, 'month').startOf('month'),
    endDate: currentDate.subtract(1, 'month').endOf('month'),
    checked: false,
  },
  last_three_months: {
    name: 'last_three_months',
    label: 'Last 3 months',
    startDate: currentDate.subtract(2, 'month').startOf('month'),
    endDate: currentDate,
    checked: false,
  },
  last_six_months: {
    name: 'last_six_months',
    label: 'Last 6 months',
    startDate: currentDate.subtract(5, 'month').startOf('month'),
    endDate: currentDate,
    checked: false,
  },
  last_twelve_months: {
    name: 'last_twelve_months',
    label: 'Last 12 months',
    startDate: currentDate.subtract(11, 'month').startOf('month'),
    endDate: currentDate,
    checked: false,
  },
  current_year: {
    name: 'current_year',
    label: 'Current year',
    startDate: dayjs(`${currentDate.year()}-01-01`),
    endDate: currentDate,
    checked: false,
  },
};

export const beforeUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.returnValue = '';
};

export enum VALIDATE_DATE_RANGE_ERROR_MESSAGE {
  END_DATE_GREATER_THAN_START_DATE = 'The end date must be greater than the start date',
  DATE_RANGE_CAN_NOT_EXCEED_365_DAYS = 'The maximum date range can not exceed 365 days',
}

export const validateDateRangeExport = (
  startPeriod: Dayjs,
  endPeriod: Dayjs
): string | undefined => {
  if (endPeriod.isBefore(startPeriod, 'd')) {
    return VALIDATE_DATE_RANGE_ERROR_MESSAGE.END_DATE_GREATER_THAN_START_DATE;
  }

  if (endPeriod.diff(startPeriod, 'd') > 365) {
    return VALIDATE_DATE_RANGE_ERROR_MESSAGE.DATE_RANGE_CAN_NOT_EXCEED_365_DAYS;
  }

  return undefined;
};
