'use client';

import './style.scss';

import { useGetUnits } from '@esp/components/organizations-select/organizations-select.helper';
import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import ESPPageTitle from '@esp/components/page-title';
import { APP_ROUTE } from '@esp/constants';
import useAuth from '@esp/hooks/useAuth';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useGetTimePolicies } from '../administrative-tools/(main-components)/time-policy/time-policy.helper';
import TimesheetAction from './(main-components)/timesheet-calendar/components/timesheet-calendar.action';
import TimesheetCalendarWrapper from './(main-components)/timesheet-calendar/index';
import { useGetUserTasksList } from './timesheet-helper';
import { ITimesheetFormData } from './type';

const TimeManagement = () => {
  const { optionUnits } = useGetUnits();
  useGetTimePolicies();

  const { user } = useAuth();

  useGetUserTasksList(user?.employeeId as string);

  const currentUnits = useMemo(() => {
    return optionUnits.find((i) => i.value === user?.employeeId);
  }, [optionUnits, user?.employeeId]);

  const defaultUnits: IOrganizationUnitOptions = useMemo(() => {
    return {
      isEmployee: true,
      label: user?.name as string,
      value: user?.employeeId as string,
    };
  }, [user?.name, user?.employeeId]);

  const { control, setValue, watch } = useForm<ITimesheetFormData>({
    defaultValues: {
      units: (currentUnits ? currentUnits : defaultUnits) as IOrganizationUnitOptions,
      startDate: dayjs().startOf('M').startOf('D').toISOString(),
      endDate: dayjs().endOf('M').endOf('D').toISOString(),
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const units = watch('units');

  const formValue = useMemo(() => {
    return { startDate, endDate, units };
  }, [startDate, endDate, units]);

  const onFilterTimesheet = useCallback(
    (date?: Dayjs) => {
      if (date) {
        setValue('startDate', date.startOf('M').startOf('D').toISOString());
        setValue('endDate', date.endOf('M').endOf('D').toISOString());
      }
    },
    [setValue]
  );

  return (
    <>
      <ESPPageTitle
        title="Timesheet"
        breadcrumbs={[
          {
            name: 'Time Management',
            href: APP_ROUTE.TIME_MANAGEMENT,
          },
          {
            name: 'Timesheet',
          },
        ]}
        actions={
          <TimesheetAction
            control={control}
            setValue={setValue}
            onFilterTimesheet={onFilterTimesheet}
            units={formValue.units}
          />
        }
      />

      <TimesheetCalendarWrapper formValue={formValue} onFilterTimesheet={onFilterTimesheet} />
    </>
  );
};

export default TimeManagement;
