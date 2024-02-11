'use client';

import './attendance-log.scss';

import { exportAttendanceLogs } from '@esp/apis/time-management';
import OrganizationsSelection from '@esp/components/organizations-select';
import {
  getEmployeeIds,
  useGetUnits,
} from '@esp/components/organizations-select/organizations-select.helper';
import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import { APP_ROUTE } from '@esp/constants';
import useAuth from '@esp/hooks/useAuth';
import Link from '@esp/libs/next-link';
import { required, sanitizeRules } from '@esp/utils/rhf-validation';
import GetAppIcon from '@mui/icons-material/GetApp';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ESPAutocomplete } from '@ui-kit/components/autocomplete';
import { ESPButton } from '@ui-kit/components/button';
import { ESPDaterangepicker } from '@ui-kit/components/date-range-picker';
import { ESPFormControl } from '@ui-kit/components/form-control';
import { IExtendParams, ILoadOptions } from '@ui-kit/components/table/type';
import { useNotify } from '@ui-kit/contexts/notify-context';
import dayjs from 'dayjs';
import loUniq from 'lodash/uniq';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, UseFormWatch } from 'react-hook-form';

import { formatEndDate, formatStartDate } from './attendance-log.helper';
import { AttendanceFilterFormData, IAttendanceLogActionProps } from './attendance-log.type';

export const ButtonAction = ({
  watch,
  handleExport,
  isFilterDataEmptied,
  isDirty,
  setIsDirty,
}: {
  watch: UseFormWatch<AttendanceFilterFormData>;
  handleExport: () => void;
  isFilterDataEmptied: boolean | undefined;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}) => {
  const wacthUnits = watch('units');
  const wacthPeriod = watch('period');
  const wacthRemarks = watch('remark');

  const theme = useTheme();

  useEffect(() => {
    setIsDirty(true);
  }, [wacthUnits, wacthPeriod, wacthRemarks]);

  const noOptionsIsSelected = !wacthUnits?.length || !wacthPeriod?.[0] || !wacthPeriod?.[1];

  return (
    <>
      <ESPButton
        type="submit"
        disabled={noOptionsIsSelected}
        onClick={() => {
          setIsDirty(false);
        }}
      >
        Filter
      </ESPButton>

      <ESPButton
        color="secondary"
        sx={{ color: theme.palette.primary.main }}
        startIcon={<GetAppIcon />}
        disabled={isFilterDataEmptied || noOptionsIsSelected || isDirty}
        onClick={() => handleExport()}
      >
        Export
      </ESPButton>
    </>
  );
};

const REMARK_OPTIONS = [
  {
    value: 'All',
    label: 'All',
    allOption: true,
  },
  {
    value: 'No Remarks',
    label: 'Blank',
  },
  {
    value: 'Missing Attendance',
    label: 'Missing Attendance',
  },
  {
    value: 'Missing Check-out',
    label: 'Missing Check-out',
  },
  {
    value: 'Late in',
    label: 'Late in',
  },
  {
    value: 'Early out',
    label: 'Early out',
  },
  {
    value: 'Late in & Early out',
    label: 'Late in & Early out',
  },
];

const AttendanceLogAction = memo(
  ({ onLoadOptionsChange, resetPageOptions, isFilterDataEmptied }: IAttendanceLogActionProps) => {
    const { user } = useAuth();

    const { notifySuccess } = useNotify();
    const { optionUnits } = useGetUnits();

    const [isDirty, setIsDirty] = useState(false);

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

    const initDefaultValues = {
      period: [dayjs().startOf('M'), dayjs().endOf('M')],
      units: (currentUnits ? [currentUnits] : [defaultUnits]) as IOrganizationUnitOptions[],
    };

    const { control, handleSubmit, getValues, watch, setValue } = useForm<AttendanceFilterFormData>(
      {
        defaultValues: initDefaultValues,
      }
    );

    const parseFilter = useCallback(
      (data: AttendanceFilterFormData) => {
        const [startDate, endDate] = data.period || [];

        const { units } = data;

        const employeeIds = loUniq(
          getEmployeeIds(units as IOrganizationUnitOptions[], optionUnits)
        );

        const result = {
          startDate: startDate ? formatStartDate(startDate) : undefined,
          endDate: endDate ? formatEndDate(endDate) : undefined,
          employeeIds,
          remarks: data.remark?.find((item) => item.allOption)
            ? []
            : data.remark?.map((item) => item.value as string),
        };

        return result;
      },
      [optionUnits]
    );

    const handleFilter = useCallback(
      (data: AttendanceFilterFormData) => {
        const bodyData = parseFilter(data) as IExtendParams;

        const tmpLoadOptions: ILoadOptions = {
          skip: 0,
        };

        onLoadOptionsChange(tmpLoadOptions, bodyData);
        resetPageOptions();
      },
      [onLoadOptionsChange, parseFilter, resetPageOptions]
    );

    useEffect(() => {
      if (defaultUnits) {
        handleFilter({
          units: [defaultUnits],
          period: getValues().period,
        });

        setIsDirty(false);
      }
    }, [defaultUnits, handleFilter, getValues]);

    useEffect(() => {
      if (currentUnits) {
        setValue('units', [currentUnits]);
      }
    }, [currentUnits, setValue, handleFilter, getValues]);

    const handleExport = async () => {
      const bodyData = parseFilter(getValues());

      exportAttendanceLogs(bodyData, user?.id as string);

      notifySuccess(
        <div>
          Please check{' '}
          <Link className="esp-attendance-log-notify" href={APP_ROUTE.EXPORT}>
            Export history
          </Link>
        </div>
      );
    };

    const onUnitsChange = useCallback(
      (...params: unknown[]) => {
        setValue('units', params[0] as IOrganizationUnitOptions[]);
      },
      [setValue]
    );

    return (
      <Box
        component="form"
        onSubmit={handleSubmit(handleFilter)}
        className="esp-attendance-log-action"
      >
        <Box className="esp-attendance-log-action_input">
          <Controller
            name="units"
            control={control}
            rules={sanitizeRules(required())}
            render={(params) => (
              <OrganizationsSelection multiple rhfParams={params} onChange={onUnitsChange} />
            )}
          />
        </Box>

        <Box className="esp-attendance-log-action_date-range-picker">
          <Controller
            name="period"
            rules={sanitizeRules(required())}
            control={control}
            render={(params) => (
              <ESPFormControl
                variant="outlined"
                label="Period"
                fullWidth
                rhfParams={params}
                required
              >
                <ESPDaterangepicker format="D/MMM" placeholder="D/MMM - D/MMM, YYYY" />
              </ESPFormControl>
            )}
          />
        </Box>

        <Box className="esp-attendance-log-action_input">
          <Controller
            name="remark"
            control={control}
            render={(params) => (
              <ESPFormControl
                variant="outlined"
                label="Remark"
                fullWidth
                rhfParams={params}
                sx={{
                  minWidth: '14rem',
                }}
              >
                <ESPAutocomplete
                  multiple
                  options={REMARK_OPTIONS}
                  placeholder="Select remark"
                  limitTags={1}
                  fullWidth
                />
              </ESPFormControl>
            )}
          />
        </Box>

        <Box className="esp-attendance-log-action_buttons">
          <ButtonAction
            watch={watch}
            handleExport={handleExport}
            isFilterDataEmptied={isFilterDataEmptied}
            isDirty={isDirty}
            setIsDirty={setIsDirty}
          />
        </Box>
      </Box>
    );
  }
);

AttendanceLogAction.displayName = 'AttendanceLogAction';

export default AttendanceLogAction;
