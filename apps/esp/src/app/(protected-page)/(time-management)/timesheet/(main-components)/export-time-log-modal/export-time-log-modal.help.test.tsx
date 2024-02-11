import dayjs from 'dayjs';

import {
  beforeUnload,
  VALIDATE_DATE_RANGE_ERROR_MESSAGE,
  validateDateRangeExport,
} from './export-time-log-modal.helper';

describe('Export time log modal helper', () => {
  it('should call beforeUnload function correctly', () => {
    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      returnValue: 'Some initial value',
    };

    beforeUnload(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);

    expect(mockEvent.returnValue).toBe('');
  });

  it('validateDateRangeExport should return correct message if end date is less than start date', () => {
    const startDate = dayjs();

    const endDate = dayjs().subtract(1, 'd');

    expect(validateDateRangeExport(startDate, endDate)).toBe(
      VALIDATE_DATE_RANGE_ERROR_MESSAGE.END_DATE_GREATER_THAN_START_DATE
    );
  });

  it('validateDateRangeExport should return correct message if the date range is greater than 1 year', () => {
    const startDate = dayjs();

    const endDate = dayjs().add(500, 'd');

    expect(validateDateRangeExport(startDate, endDate)).toBe(
      VALIDATE_DATE_RANGE_ERROR_MESSAGE.DATE_RANGE_CAN_NOT_EXCEED_365_DAYS
    );
  });

  it('validateDateRangeExport should return nothing', () => {
    const startDate = dayjs();

    const endDate = dayjs().add(10, 'd');

    expect(validateDateRangeExport(startDate, endDate)).toBe(undefined);
  });
});
