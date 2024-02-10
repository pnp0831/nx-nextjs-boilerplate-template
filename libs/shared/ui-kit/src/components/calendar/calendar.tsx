'use client';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getDatesBetweenTwoDays } from '../../helpers/index';
import { ESPButton } from '../button/button';
import { ESPTypography } from '../typography/typography';
import styles from './calendar.module.scss';
import { ESPCalendarProps } from './type';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const ESPCalendar: React.FC<ESPCalendarProps> = memo(
  ({
    events,
    disabledWeekend,
    disabledPast,
    disabledFuture,
    onAdd,
    onEdit,
    shouldDisabledDate,
    setCurrentDate,
    format = 'DD/MM/YYYY',
    holidays = {},
    currentDate: initCurrentDate,
  }: ESPCalendarProps) => {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [currentDate, setDate] = useState(initCurrentDate || dayjs());

    const theme = useTheme();

    const refDays = useRef<{
      [key: string]: HTMLElement | null;
    }>({});

    const refStartDay = useRef<Dayjs | null>(null);

    const currentMonth = dayjs(currentDate).month();
    const currentYear = dayjs(currentDate).year();

    useEffect(() => {
      if (initCurrentDate) {
        setDate(initCurrentDate);
      }
    }, [initCurrentDate]);

    const handleChangeDate = useCallback(
      (date: Dayjs) => {
        if (typeof setCurrentDate === 'function') {
          return setCurrentDate(date);
        }

        return setDate(date);
      },
      [setDate, setCurrentDate]
    );

    const handleRemoveSelected = useCallback(() => {
      Object.keys(refDays.current).forEach((day) => {
        const elm = refDays.current[day];

        if (elm) {
          elm.classList.remove(styles.selected);
        }
      });
    }, []);

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>, date: Dayjs) => {
      e.stopPropagation();
      if (isMouseDown) {
        setIsMouseDown(false);
        handleRemoveSelected();
        refStartDay.current = null;
      }
    }, []);

    const handleMouseDown = useCallback((_: React.MouseEvent<HTMLDivElement>, date: Dayjs) => {
      setIsMouseDown(true);
      refStartDay.current = date;
    }, []);

    const handleMouseOver = useCallback(
      (end: Dayjs, isMouseUp?: boolean) => {
        const start = refStartDay.current;

        if (start) {
          if (!isMouseUp) {
            handleRemoveSelected();
          }

          const startDate = start.isAfter(end) ? end : start;
          const endDate = start.isAfter(end) ? start : end;

          const daysBetween = getDatesBetweenTwoDays(startDate, endDate, format);

          Object.keys(daysBetween).forEach((day, index) => {
            const ele = refDays.current[day];
            if (ele) {
              ele.classList.add(styles.selected);
            }
          });
        }
      },
      [format, handleRemoveSelected]
    );

    const handleMouseUp = useCallback(
      (e: React.MouseEvent<HTMLDivElement>, end: Dayjs) => {
        handleMouseOver(end, true);
        refStartDay.current = null;
        setIsMouseDown(false);
      },
      [handleMouseOver]
    );

    const renderDaysOfMonth = () => {
      const daysInMonth = currentDate.daysInMonth();
      const firstDayOfMonth = currentDate.startOf('month').day();
      const days = [];

      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div className={clsx(styles.day, styles.empty)} key={`empty-${i}`} />);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = dayjs().month(currentMonth).year(currentYear).date(day);

        const today = currentDate.format(format) === dayjs().format(format);

        const hasEvent = events[currentDate.format(format)];

        let disabled = false;

        switch (true) {
          case disabledWeekend:
            disabled = [0, 6].includes(currentDate.day());
            break;
          case disabledFuture:
            disabled = dayjs().isBefore(currentDate, 'd');
            break;
          case disabledPast:
            disabled = dayjs().isAfter(currentDate, 'd');
            break;
          case typeof shouldDisabledDate !== 'undefined':
            if (typeof shouldDisabledDate === 'function') {
              disabled = shouldDisabledDate(currentDate);
            }
            break;

          default:
            break;
        }

        days.push(
          <div
            ref={(el) => (refDays.current[currentDate.format(format)] = el)}
            key={`day-${currentDate.format(format)}`}
            data-testid={`day-${currentDate.format(format)}`}
            className={clsx(styles.day, `date-${currentDate.format(format)}`, {
              [styles.disabled]: disabled,
              [styles.today]: today,
            })}
            onMouseDown={(e) => handleMouseDown(e, currentDate)}
            onMouseUp={(e) => handleMouseUp(e, currentDate)}
            onMouseOver={(e) => handleMouseOver(currentDate)}
            onClick={(e) => handleClick(e, currentDate)}
          >
            <ESPTypography variant={today ? 'bold_m' : 'regular_m'}> {day}</ESPTypography>
            {hasEvent && <div className={styles.dot} />}
            {holidays[currentDate.format(format)] && (
              <div className={styles.holidays}>
                <CelebrationIcon color="primary" fontSize="small" />
              </div>
            )}
            <div className={styles.dayEvent}>
              <div className={styles.overlay} />
              {hasEvent ? (
                <EditIcon
                  color="primary"
                  onClick={() => onEdit?.(hasEvent)}
                  sx={{
                    padding: '0.2rem',
                    background: theme.palette.primary.main,
                    color: theme.palette.common.white,
                  }}
                />
              ) : (
                <AddCircleOutlinedIcon color="primary" onClick={() => onAdd?.(hasEvent)} />
              )}
            </div>
          </div>
        );
      }

      return days;
    };

    const weekdays = useMemo(() => {
      return (
        <div className={styles.calendarWeekdays}>
          {WEEKDAYS.map((day, index) => (
            <ESPTypography
              variant="bold_s"
              className={styles.cell}
              key={`${day}-${index}`}
              sx={{ color: '#92929D' }}
            >
              {day}
            </ESPTypography>
          ))}
        </div>
      );
    }, []);

    const toolbars = useMemo(() => {
      return (
        <div className={styles.calendarToolbars}>
          <ESPButton size="medium" color="secondary" onClick={() => handleChangeDate(dayjs())}>
            Today
          </ESPButton>
          <div
            onClick={() => handleChangeDate(currentDate.subtract(1, 'month'))}
            style={{
              margin: '0 0.625rem',
            }}
            className={styles.calendarArrow}
          >
            <ArrowBackIosIcon fontSize="small" />
          </div>
          <div
            className={styles.calendarArrow}
            onClick={() => handleChangeDate(currentDate.add(1, 'month'))}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </div>
        </div>
      );
    }, [currentDate, handleChangeDate]);

    return (
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <ESPTypography variant="bold_l">{currentDate.format('MMMM YYYY')}</ESPTypography>
          {toolbars}
        </div>
        {weekdays}
        <div className={styles.calendarDays}>{renderDaysOfMonth()}</div>
      </div>
    );
  }
);

export default ESPCalendar;
