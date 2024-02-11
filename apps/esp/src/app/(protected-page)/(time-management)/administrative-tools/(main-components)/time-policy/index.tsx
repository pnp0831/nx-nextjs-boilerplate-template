'use client';

import './time-policy.scss';

import { ITimePolicies } from '@esp/apis/time-management';
import { DEFAULT_TIME_POLICIES } from '@esp/constants';
import { useAppClientConfig } from '@esp/contexts/app-client-config-context';
import useAuth from '@esp/hooks/useAuth';
import { ESPButton } from '@ui-kit/components/button';
import { ESPFormControl } from '@ui-kit/components/form-control';
import { ESPInfoTooltip } from '@ui-kit/components/info-tooltip';
import { ESPInput } from '@ui-kit/components/text-input';
import { ESPTimeField } from '@ui-kit/components/time-field';
import { useNotify } from '@ui-kit/contexts/notify-context';
import dayjs, { Dayjs } from 'dayjs';
import React, { memo, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  ITPFormData,
  MAX_DURATION_FIELD,
  TIME_POLICY_INPUT,
  useGetTimePolicies,
} from './time-policy.helper';

const INDEX_TO_HIDE = [2, 3, 4];

const TimePolicy = memo(() => {
  //#region Hooks
  const { appConfigs } = useAppClientConfig();
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotify();
  const { data: masterTimePolicies, mutation } = useGetTimePolicies();
  const { control, handleSubmit, getValues, formState, reset } = useForm<ITPFormData>({
    defaultValues: {
      ...DEFAULT_TIME_POLICIES,
      branchId: user?.branchId,
      organizationId: user?.organizationId,
    },
  });

  const setDefaultValueForForm = useCallback(
    (data: ITimePolicies) => {
      // In order for isDirty to work, all the data saved in default values have to match formValue
      // that's why i set default values to be all string

      const formDataInString: ITPFormData = {
        ...data,
        statementDate: JSON.stringify(data.statementDate),
        allowedLateIn: JSON.stringify(data.allowedLateIn),
        allowedEarlyOut: JSON.stringify(data.allowedEarlyOut),
        minimumDurationPerLog: JSON.stringify(data.minimumDurationPerLog),
        maximumDurationPerLog: dayjs().startOf('day').add(data.maximumDurationPerLog, 'minute'),
      };
      reset(formDataInString);
    },
    [reset]
  );

  useEffect(() => {
    if (masterTimePolicies) {
      setDefaultValueForForm(masterTimePolicies);
    }
  }, [masterTimePolicies, setDefaultValueForForm]);

  //#endregion

  const onSubmit = () => {
    const formValues = getValues();

    const resultingMaxDurationInMins =
      (formValues.maximumDurationPerLog as Dayjs).hour() * 60 +
      (formValues.maximumDurationPerLog as Dayjs).minute();

    const newTimePolicies = {
      statementDate: Number(formValues.statementDate),
      allowedLateIn: Number(formValues.allowedLateIn),
      allowedEarlyOut: Number(formValues.allowedEarlyOut),
      minimumDurationPerLog: Number(formValues.minimumDurationPerLog),
      maximumDurationPerLog: resultingMaxDurationInMins,
      organizationId: formValues.organizationId,
      branchId: formValues.branchId,
    };

    mutation.mutate(newTimePolicies, {
      onSuccess: () => {
        setDefaultValueForForm(formValues as ITimePolicies);
        notifySuccess('Successfully updated');
      },
      onError: (err) => notifyError(err),
    });
  };

  const endAdornment = (msg: string) => {
    return <div style={{ color: 'grey' }}>{msg}</div>;
  };

  return (
    <form className="time-policy-form" onSubmit={handleSubmit(onSubmit)}>
      {TIME_POLICY_INPUT.filter((input, index) =>
        appConfigs.client.hideTimePolicy ? !INDEX_TO_HIDE.includes(index) : input
      ).map((input, index) => {
        return input.isDivider ? (
          <div className="divider" key={index} />
        ) : (
          <Controller
            key={input.name}
            name={input.name}
            control={control}
            rules={input.rules}
            render={(params) => {
              return (
                <ESPFormControl
                  variant="outlined"
                  label={
                    <div className="time-policy-form__label">
                      {input.label}
                      <ESPInfoTooltip content={input.toolTipContent} />
                    </div>
                  }
                  rhfParams={params}
                >
                  {input.name === MAX_DURATION_FIELD ? (
                    <ESPTimeField
                      size="large"
                      format="HH:mm"
                      className="esp-max-duration-field"
                      endAdornment={endAdornment('HH:mm')}
                    />
                  ) : (
                    <ESPInput
                      type="number"
                      endAdornment={input.endAdornment ? endAdornment('minutes') : null}
                    />
                  )}
                </ESPFormControl>
              );
            }}
          />
        );
      })}
      <div className="form-handle-button-group">
        <ESPButton
          size="large"
          color="secondary"
          onClick={() => {
            setDefaultValueForForm(masterTimePolicies as ITimePolicies);
          }}
        >
          Reset
        </ESPButton>
        <ESPButton
          size="large"
          type="submit"
          disabled={!formState.isDirty}
          loading={mutation.isLoading}
        >
          Save
        </ESPButton>
      </div>
    </form>
  );
});

TimePolicy.displayName = 'TimePolicy';

export default TimePolicy;
