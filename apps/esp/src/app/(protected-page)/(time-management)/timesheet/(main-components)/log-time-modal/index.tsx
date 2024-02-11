'use client';

import { IPostUserTimeLog, postUserTimeLog } from '@esp/apis/task-management';
import { putUserTimeLog } from '@esp/apis/time-management';
import useAuth from '@esp/hooks/useAuth';
import { required, sanitizeRules } from '@esp/utils/rhf-validation';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ESPAutocompleteEnhancement } from '@ui-kit/components//autocomplete-enhancement';
import { ESPButton } from '@ui-kit/components/button';
import { ESPCheckbox } from '@ui-kit/components/checkbox';
import { ESPDatepicker } from '@ui-kit/components/date-picker';
import { ESPFormControl, ESPFormControlLabel } from '@ui-kit/components/form-control';
import { ESPModal } from '@ui-kit/components/modal';
import { ESPSwitch } from '@ui-kit/components/switch';
import { ESPTextField } from '@ui-kit/components/text-field';
import { ESPTimeField } from '@ui-kit/components/time-field';
import { ESPTypography } from '@ui-kit/components/typography';
import { useNotify } from '@ui-kit/contexts/notify-context';
import dayjs from 'dayjs';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useGetTimePolicies } from '../../../administrative-tools/(main-components)/time-policy/time-policy.helper';
import {
  addDurationToDateTime,
  convertDayJsDurationToMinutes,
  customizeLabelInput,
  formatDateBasedOnStatementDate,
  formatDurationToHourAndMinutes,
  getStartDate,
  getTimeZone,
  validateMaximumLogTimeBeforeSubmit,
  validateMinumumLogTimeBeforeSubmit,
} from '../../timesheet-helper';
import { useGetUserTasksList } from '../../timesheet-helper';
import {
  IDataLogTimeProps,
  IOnSubmitParams,
  LogTimeModalProps,
  TasksOption,
} from './log-time-modal.type';

const getDefaulTaskSelected = (
  listOptions: TasksOption[],
  selectedTask: Partial<TasksOption> | undefined
): TasksOption | undefined => {
  if (!selectedTask) {
    return listOptions[0];
  }

  const defaultTask = listOptions.find((item: TasksOption) => {
    return item.value === selectedTask?.value;
  });

  return defaultTask;
};

const LogTimeModal = memo(
  ({
    openLogTimeModal,
    setOpenLogTimeModal,
    showCheckbox = true,
    data,
    listOptions,
    onSubmitCallback,
    employeeId,
  }: LogTimeModalProps) => {
    const isSmallScreen = useMediaQuery('(max-height:800px)');

    const { data: policyTime } = useGetTimePolicies();
    const { data: fetchedTaskList } = useGetUserTasksList(employeeId);

    const [taskList, setTaskList] = useState<TasksOption[]>(() => {
      if (!fetchedTaskList) {
        return listOptions || [];
      }

      const uniqueNames: TasksOption[] =
        fetchedTaskList.map((item) => ({
          taskCode: item.taskCode,
          taskName: item.taskName,
          value: item.id,
          label: `${item.taskCode} - ${item.taskName}`,
        })) || [];

      return uniqueNames;
    });

    const defaultTime = useMemo(() => dayjs().startOf('day'), []);

    const [enabledDescription, setEnabledDescription] = useState(data?.description ? true : false);

    const [isLoggedAnother, setIsLoggedAnother] = useState(false);

    const { notifySuccess, notifyError } = useNotify();

    const { user } = useAuth();

    const minimumLogTime = policyTime?.minimumDurationPerLog as number;
    const maximumLogTime = policyTime?.maximumDurationPerLog as number;

    const minDateBasedOnStatementDate = useMemo(() => {
      const formatStatementDate = dayjs(
        formatDateBasedOnStatementDate(policyTime?.statementDate as number)
      );

      if (formatStatementDate.isBefore(defaultTime, 'day')) {
        return formatStatementDate.add(1, 'day');
      }

      return dayjs().startOf('month');
    }, []);

    const timeZone = getTimeZone();

    const { control, handleSubmit, getValues, reset, setError, formState, setValue } =
      useForm<IDataLogTimeProps>({
        defaultValues: {
          datePicker: data?.datePicker || defaultTime,
          duration: data?.duration || defaultTime,
          description: data?.description ?? '',
          selectedTask: getDefaulTaskSelected(taskList, data?.selectedTask),
        },
      });

    useEffect(() => {
      if (fetchedTaskList) {
        const uniqueNames: TasksOption[] = fetchedTaskList.map((item) => ({
          taskCode: item.taskCode,
          taskName: item.taskName,
          value: item.id,
          label: `${item.taskCode} - ${item.taskName}`,
        }));

        setTaskList(uniqueNames);

        setValue('selectedTask', uniqueNames[0]);
      }
    }, [fetchedTaskList, setValue]);

    const onSubmit = async () => {
      const formData = getValues();

      if (validateMinumumLogTimeBeforeSubmit(formData, minimumLogTime) === false) {
        setError('duration', {
          type: 'manual',
          message: `Logged time must be greater than ${minimumLogTime} minutes`,
        });
        return;
      }

      if (validateMaximumLogTimeBeforeSubmit(formData, maximumLogTime) === false) {
        setError('duration', {
          type: 'manual',
          message: `Logged time must be smaller than ${formatDurationToHourAndMinutes(
            maximumLogTime
          )}`,
        });
        return;
      }

      const formattedStartDate = formData?.datePicker?.format('YYYY-MM-DD');
      const formattedTime = formData?.duration?.format('HH:mm:ss');

      const startDate = getStartDate(formattedStartDate, timeZone);

      const formattedData: IPostUserTimeLog = {
        employeeId: employeeId || user?.employeeId,
        taskId: (formData.selectedTask as TasksOption).value,
        startDate,
        endDate: addDurationToDateTime(startDate, formattedTime, timeZone),
        description: formData.description ?? '',
        ...(data?.id && { id: data?.id }),
      };

      try {
        let idTask;

        if (data?.id) {
          const { data: dataPutUserTaskList } = await putUserTimeLog(
            formattedData,
            user?.employeeId as string,
            user?.id as string
          );

          idTask = dataPutUserTaskList;
          notifySuccess('Successfully updated');
        } else {
          const { data: dataPostUserTaskList } = await postUserTimeLog(
            formattedData,
            user?.employeeId as string,
            user?.organizationId as string,
            user?.branchId as string,
            user?.id as string
          );

          idTask = dataPostUserTaskList;
          notifySuccess('Successfully logged time');
        }

        if (isLoggedAnother) {
          reset();
          setEnabledDescription(false);
        } else {
          setOpenLogTimeModal(false);
        }

        if (onSubmitCallback) {
          const params: IOnSubmitParams = {
            id: idTask,
            taskId: formData.selectedTask.value as string,
            employeeId: formattedData.employeeId as string,
            startDate: formattedData.startDate,
            endDate: formattedData.endDate,
            description: formattedData.description,
            duration: convertDayJsDurationToMinutes(formData.duration),
          };

          onSubmitCallback(params, data?.id ? 'edit' : 'add');
        }
      } catch (err) {
        notifyError(err);
      }
    };

    const refFocus = useRef(false);

    return (
      <ESPModal
        title={data?.id ? 'Edit Time Log' : 'Log Time'}
        open={openLogTimeModal}
        onClose={() => {
          reset();
          setOpenLogTimeModal(false);
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ minWidth: '30rem' }}>
          <Controller
            name="selectedTask"
            rules={sanitizeRules<IDataLogTimeProps>(required())}
            control={control}
            render={(params) => (
              <ESPFormControl
                sx={{ paddingTop: '0.25rem' }}
                variant="outlined"
                label={'Task'}
                fullWidth
                required
                rhfParams={params}
              >
                <ESPAutocompleteEnhancement
                  size="small"
                  seachingLocal
                  renderOption={(props, initOption) => {
                    const option = { ...initOption } as TasksOption;
                    return (
                      <Box component="li" sx={{}} {...props}>
                        <Box
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {option.taskCode} - {option.taskName}
                        </Box>
                        {props['aria-selected'] && <CheckIcon />}
                      </Box>
                    );
                  }}
                  disabled={!!data?.id}
                  blurOnSelect
                  renderInput={(params) => {
                    return (
                      <ESPTextField
                        {...params}
                        placeholder="Select Task"
                        onFocus={() => {
                          refFocus.current = true;
                        }}
                        onBlur={() => {
                          refFocus.current = false;
                        }}
                        inputProps={{
                          ...params.inputProps,
                          value:
                            params.inputProps?.value && !refFocus.current
                              ? customizeLabelInput(params.inputProps.value)
                              : params.inputProps?.value,
                        }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment:
                            params.inputProps?.value && !refFocus.current ? (
                              <ESPTypography variant="bold_m" component="span">
                                [{params.inputProps.value.split(' ')[0]}]
                              </ESPTypography>
                            ) : null,
                        }}
                      />
                    );
                  }}
                  options={taskList}
                  fullWidth
                />
              </ESPFormControl>
            )}
          />

          <Box sx={{ display: 'flex' }}>
            <Controller
              name={'datePicker'}
              control={control}
              rules={sanitizeRules<IDataLogTimeProps>(required())}
              defaultValue={dayjs(new Date())}
              render={(params) => (
                <ESPFormControl
                  sx={{ marginTop: '1.25rem', maxWidth: '8.75rem', marginRight: '0.75rem' }}
                  variant="outlined"
                  label={'Date'}
                  fullWidth
                  required
                  rhfParams={params}
                >
                  <ESPDatepicker
                    defaultValue={dayjs(new Date())}
                    sx={{ maxWidth: '8.75rem' }}
                    minDate={minDateBasedOnStatementDate}
                    popoverPosition={isSmallScreen ? 'right-end' : 'bottom-end'}
                  />
                </ESPFormControl>
              )}
            />

            <Box className="time-input">
              <Controller
                name={'duration'}
                control={control}
                rules={sanitizeRules<IDataLogTimeProps>(required())}
                render={(params) => (
                  <ESPFormControl
                    sx={{ marginTop: '1.25rem' }}
                    variant="outlined"
                    label={'Duration'}
                    fullWidth
                    required
                    rhfParams={params}
                  >
                    <ESPTimeField format={'HH:mm'} />
                  </ESPFormControl>
                )}
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: '1.25rem' }}>
            <Box sx={{ marginBottom: '0.75rem' }}>
              <ESPTypography variant="bold_m" sx={{ marginRight: '0.25rem' }}>
                Description
              </ESPTypography>
              <ESPSwitch
                checked={enabledDescription}
                onChange={() => setEnabledDescription(!enabledDescription)}
              />
            </Box>
            {enabledDescription && (
              <Controller
                name="description"
                control={control}
                rules={sanitizeRules<IDataLogTimeProps>(required())}
                render={(params) => (
                  <ESPFormControl variant="outlined" fullWidth rhfParams={params}>
                    <ESPTextField
                      data-testid="log-time-textarea"
                      size={'large'}
                      sx={{ width: '100%' }}
                      multiline
                      rows={4}
                    />
                  </ESPFormControl>
                )}
              />
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: showCheckbox ? 'space-between' : 'flex-end',
              paddingTop: '0.5rem',
              paddingBottom: '1.25rem',
            }}
          >
            {showCheckbox && (
              <ESPFormControl variant="outlined">
                <ESPFormControlLabel
                  sx={{ marginLeft: '0' }}
                  control={
                    <ESPCheckbox
                      sx={{ padding: '0.20rem 0.5rem 0.20rem 0.20rem' }}
                      checked={isLoggedAnother}
                      onChange={() => setIsLoggedAnother(!isLoggedAnother)}
                    />
                  }
                  label="Log another"
                />
              </ESPFormControl>
            )}
            <Box>
              <ESPButton
                color="secondary"
                onClick={() => {
                  reset();
                  setOpenLogTimeModal(false);
                }}
              >
                Cancel
              </ESPButton>
              <ESPButton
                sx={{ marginLeft: '0.5rem' }}
                type="submit"
                data-testid="log-time-submit"
                loading={formState.isSubmitting}
                disabled={formState.isSubmitting || (!!data?.id && !formState.isDirty)}
              >
                {data?.id ? 'Update' : 'Log'}
              </ESPButton>
            </Box>
          </Box>
        </Box>
      </ESPModal>
    );
  }
);

LogTimeModal.displayName = 'LogTimeModal';

export default LogTimeModal;
