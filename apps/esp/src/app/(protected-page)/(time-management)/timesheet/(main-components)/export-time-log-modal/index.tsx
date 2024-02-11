import './export-time-log-modal.scss';

import { getProgressInformationById } from '@esp/apis/progress-management';
import { IParamExportTimeLog, postTimeLogExport } from '@esp/apis/time-management';
import {
  getEmployeeIds,
  useGetUnits,
} from '@esp/components/organizations-select/organizations-select.helper';
import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import useAuth from '@esp/hooks/useAuth';
import { Box } from '@mui/material';
import { ESPModal } from '@ui-kit/components/modal';
import { useNotify } from '@ui-kit/contexts/notify-context';
import dayjs, { Dayjs } from 'dayjs';
import loUniq from 'lodash/uniq';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { ExportTimeLogDetailModal } from './components/export-time-log-detail-modal.component';
import { ExportTimeLogPendingModal } from './components/export-time-log-pending-modal.component';
import {
  beforeUnload,
  CURRENT_MONTH,
  CURRENT_YEAR,
  PERIOD_OPTION,
} from './export-time-log-modal.helper';
import { ExportLogTimeFormData, ExportLogTimeProps } from './export-time-log-modal.type';

const ExportTimeLogModal = memo(
  ({
    open,
    onClose,
    onSuccess,
    className,
    hideBackdrop,
    title,
    onError,
    id,
    isModalInProgress,
    formData,
  }: ExportLogTimeProps) => {
    const { user } = useAuth();
    const { notifyError } = useNotify();

    const defaultUnits: IOrganizationUnitOptions = useMemo(() => {
      return {
        isEmployee: true,
        label: user?.name as string,
        value: user?.employeeId as string,
      };
    }, [user]);

    const {
      control,
      handleSubmit,
      getValues,
      reset,
      setValue,
      watch,
      setError,
      formState: { isSubmitting },
      clearErrors,
    } = useForm<ExportLogTimeFormData>({
      defaultValues: formData
        ? {
            units: formData.employeeIds,
            startPeriod: dayjs(formData.startDate),
            endPeriod:
              // use today if user is currently viewing the current month
              // otherwise, choose the end day of currently viewing month
              dayjs(formData.endDate).month() === dayjs().month()
                ? dayjs(new Date())
                : dayjs(formData.endDate),
          }
        : {
            units: [defaultUnits] as IOrganizationUnitOptions[],
            startPeriod: dayjs(new Date()).startOf('month'),
            endPeriod: dayjs(new Date()),
          },
    });

    const onUnload = useCallback(
      (e: BeforeUnloadEvent) => {
        if (isSubmitting) {
          // remove modal
          return onClose(true);
        }
      },
      [isSubmitting]
    );

    const wacthStartPeriod = watch('startPeriod');
    const wacthEndPeriod = watch('endPeriod');
    const watchCurrentMonth = watch('current_month');

    const handleDataChange = (name: string) => {
      Object.values(PERIOD_OPTION).forEach((item) => {
        if (item.name === name) {
          setValue(item.name as keyof ExportLogTimeFormData, true);
          setValue('startPeriod', item.startDate);
          setValue('endPeriod', item.endDate);
        } else {
          setValue(item.name as keyof ExportLogTimeFormData, false);
        }
      });
    };

    const setOptionBasedOnDatePicker = useCallback(
      (start: Dayjs, end: Dayjs, selectedOption?: string) => {
        const matchedOption = Object.keys(PERIOD_OPTION).find((item) => {
          return (
            PERIOD_OPTION[item].startDate.format('DD/MM/YYYY') === start.format('DD/MM/YYYY') &&
            PERIOD_OPTION[item].endDate.format('DD/MM/YYYY') === end.format('DD/MM/YYYY')
          );
        });

        if (selectedOption === CURRENT_YEAR && matchedOption === CURRENT_MONTH) {
          handleDataChange(selectedOption);

          return;
        }

        if (matchedOption) {
          handleDataChange(matchedOption);
        } else {
          handleDataChange('');
        }
      },
      []
    );

    useEffect(() => {
      const data = getValues();

      const selectedOpton = Object.keys(data)?.find((keyName) => {
        return data[keyName as keyof ExportLogTimeFormData] === true;
      });

      setOptionBasedOnDatePicker(wacthStartPeriod, wacthEndPeriod, selectedOpton);
    }, [wacthStartPeriod, wacthEndPeriod, setOptionBasedOnDatePicker, watchCurrentMonth]);

    const { optionUnits } = useGetUnits();
    const handleOrgUnitsChange = (params: IOrganizationUnitOptions[]) => {
      setValue('units', params);
    };

    const currentUnits = formData
      ? optionUnits.find((i) => i.value === formData.employeeIds[0].value)
      : optionUnits.find((i) => i.value === user?.employeeId);

    useEffect(() => {
      if (currentUnits) {
        setValue('units', [currentUnits]);
      }
    }, [currentUnits, setValue]);

    useEffect(() => {
      if (isSubmitting) {
        window.addEventListener('beforeunload', beforeUnload);
        window.addEventListener('onunload', onUnload);
      }

      return () => {
        window.removeEventListener('beforeunload', beforeUnload);
        window.removeEventListener('onunload', onUnload);
      };
    }, [isSubmitting]);

    const onSubmit = async () => {
      const formValues = getValues();

      const formattedStartDate = formValues?.startPeriod.startOf('d').toISOString();
      const formattedEndDate = formValues?.endPeriod.endOf('d').toISOString();

      const employeeIds = loUniq(
        getEmployeeIds(formValues.units as IOrganizationUnitOptions[], optionUnits)
      );

      const formattedData: IParamExportTimeLog = {
        employeeIds,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      try {
        const { data } = await postTimeLogExport(formattedData);

        // take last progress for check status

        const lastProgressId = data.at(-1) as string;

        const { data: progressInfo } = await getProgressInformationById(lastProgressId);

        onSuccess(lastProgressId, data, progressInfo.fileName as string);
      } catch (err) {
        onError();
        notifyError(err);
      }
    };

    const onCloseModalPending = useCallback(() => {
      onClose();
    }, []);

    return (
      <ESPModal
        id={id}
        fullWidth
        maxWidth="sm"
        keepMounted
        className={className}
        title={title}
        open={open}
        hideCloseIcon
        hideBackdrop={hideBackdrop}
      >
        <Box className="esp-export-time-log" component="form" onSubmit={handleSubmit(onSubmit)}>
          {isModalInProgress ? (
            <ExportTimeLogPendingModal onClose={onCloseModalPending} />
          ) : (
            <ExportTimeLogDetailModal
              resetModal={reset}
              onCloseModal={onClose}
              control={control}
              isSubmitting={isSubmitting}
              handleOrgUnitsChange={handleOrgUnitsChange}
              handleCheckbox={handleDataChange}
              getValues={getValues}
              setError={setError}
              clearErrors={clearErrors}
            />
          )}
        </Box>
      </ESPModal>
    );
  }
);

ExportTimeLogModal.displayName = 'ExportTimeLogModal';

export default ExportTimeLogModal;
