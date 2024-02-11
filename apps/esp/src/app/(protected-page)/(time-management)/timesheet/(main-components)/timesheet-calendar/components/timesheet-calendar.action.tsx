'use client';

import OrganizationsSelection from '@esp/components/organizations-select';
import { useGetUnits } from '@esp/components/organizations-select/organizations-select.helper';
import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import { required, sanitizeRules } from '@esp/utils/rhf-validation';
import Box from '@mui/material/Box';
import { ESPButton } from '@ui-kit/components/button';
import { ESPFormControlRhfParams } from '@ui-kit/components/form-control';
import { Dayjs } from 'dayjs';
import React, { memo, useState } from 'react';
import { Control, Controller, FieldValues, UseFormSetValue } from 'react-hook-form';

import { ITimesheetFormData } from '../../../type';

const TimesheetAction = memo(
  ({
    control,
    onFilterTimesheet,
    setValue,
    units: initUnits,
  }: {
    control?: Control<ITimesheetFormData>;
    onFilterTimesheet: (date?: Dayjs) => void;
    setValue: UseFormSetValue<ITimesheetFormData>;
    units: IOrganizationUnitOptions | undefined;
  }) => {
    const [units, setUnits] = useState<IOrganizationUnitOptions | undefined>(initUnits);

    const { optionUnits, loading } = useGetUnits();

    const shouldHiddenTimesheetAction =
      loading || optionUnits.filter((i) => i.isEmployee).length === 1;

    if (shouldHiddenTimesheetAction) {
      return <Box className="esp-timesheet-fake-action" />;
    }

    const onChange = (...params: unknown[]) => {
      const value = params[0] as IOrganizationUnitOptions;
      setUnits(value);
    };

    const onApply = () => {
      setValue('units', units);
      onFilterTimesheet();
    };

    return (
      <>
        <Controller
          name="units"
          control={control}
          rules={sanitizeRules<ITimesheetFormData>(required())}
          render={(params) => (
            <OrganizationsSelection
              onChange={onChange}
              rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
              excludeUnit
            />
          )}
        />

        <ESPButton
          size="medium"
          onClick={onApply}
          disabled={!units}
          className="esp-timesheet-btn-apply"
        >
          Apply
        </ESPButton>
      </>
    );
  }
);

TimesheetAction.displayName = 'TimesheetAction';

export default TimesheetAction;
