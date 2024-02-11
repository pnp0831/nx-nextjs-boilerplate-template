import './export-time-log-components.scss';

import OrganizationsSelection from '@esp/components/organizations-select';
import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import { required, sanitizeRules } from '@esp/utils/rhf-validation';
import { Box, FormGroup } from '@mui/material';
import { ESPButton } from '@ui-kit/components/button';
import { ESPCheckbox } from '@ui-kit/components/checkbox';
import { ESPDatepicker } from '@ui-kit/components/date-picker';
import {
  ESPFormControl,
  ESPFormControlLabel,
  ESPFormControlRhfParams,
} from '@ui-kit/components/form-control';
import { ESPTypography } from '@ui-kit/components/typography';
import { memo, useCallback, useEffect } from 'react';
import { Controller, FieldValues } from 'react-hook-form';

import { PERIOD_OPTION, validateDateRangeExport } from '../export-time-log-modal.helper';
import {
  ExportLogTimeFormData,
  ICustomControllerProps,
  IExportTimeLogDetailModal,
} from '../export-time-log-modal.type';

const CustomController = memo(
  ({ control, getValues, render, name, setError, clearErrors }: ICustomControllerProps) => {
    const startPeriod = getValues()?.startPeriod;
    const endPeriod = getValues()?.endPeriod;

    useEffect(() => {
      if (startPeriod && endPeriod) {
        const errorMessage = validateDateRangeExport(startPeriod, endPeriod);

        if (errorMessage) {
          return setError(name, {
            type: 'validate',
            message: errorMessage,
          });
        }

        return clearErrors(name);
      }
    }, [startPeriod, endPeriod, getValues, setError, name, clearErrors]);

    return (
      <Controller
        name={name}
        control={control}
        rules={sanitizeRules<ExportLogTimeFormData>(required(), {
          validate: (_, formValue) =>
            validateDateRangeExport(formValue.startPeriod, formValue.endPeriod),
        })}
        render={render}
      />
    );
  }
);

export const ExportTimeLogDetailModal = memo(
  ({
    resetModal,
    onCloseModal,
    control,
    isSubmitting,
    handleCheckbox,
    handleOrgUnitsChange,
    getValues,
    setError,
    clearErrors,
  }: IExportTimeLogDetailModal) => {
    const onUnitsChange = useCallback(
      (...params: unknown[]) => handleOrgUnitsChange(params[0] as IOrganizationUnitOptions[]),
      [handleOrgUnitsChange]
    );

    return (
      <Box>
        <Controller
          rules={sanitizeRules<ExportLogTimeFormData>(required())}
          name="units"
          control={control}
          render={(params) => (
            <OrganizationsSelection
              multiple
              rhfParams={params as unknown as ESPFormControlRhfParams<FieldValues>}
              // onChange={(params) => handleOrgUnitsChange(params as IOrganizationUnitOptions[])}
              onChange={onUnitsChange}
            />
          )}
        />
        <Box className="esp-export-detail-units">
          <FormGroup className="esp-export-detail-units_form" data-testid="exportFormPeriodOptions">
            {Object.values(PERIOD_OPTION).map((checkbox) => {
              return (
                <Controller
                  key={checkbox.name}
                  name={checkbox.name as keyof ExportLogTimeFormData}
                  control={control}
                  render={(params) => {
                    return (
                      <ESPFormControl
                        className="esp-export-detail-units_form_control"
                        variant="outlined"
                        fullWidth
                        required
                        rhfParams={params}
                      >
                        <ESPFormControlLabel
                          className="esp-export-detail-units_form_control_label"
                          key={checkbox.name}
                          control={
                            <ESPCheckbox
                              className="esp-export-detail-units_form_checkbox"
                              checked={
                                getValues()?.[checkbox.name as keyof ExportLogTimeFormData] === true
                              }
                              onChange={() => {
                                handleCheckbox(checkbox.name);
                              }}
                              round
                            />
                          }
                          label={checkbox.label}
                        />
                      </ESPFormControl>
                    );
                  }}
                />
              );
            })}
          </FormGroup>
        </Box>

        <Box className="esp-export-detail-period">
          <ESPTypography className="esp-export-detail-period_headline" variant="bold_m">
            Period
          </ESPTypography>
          <Box className="esp-export-detail-period_options">
            <CustomController
              name="startPeriod"
              control={control}
              getValues={getValues}
              setError={setError}
              clearErrors={clearErrors}
              render={(params) => (
                <ESPFormControl variant="outlined" fullWidth required rhfParams={params}>
                  <ESPDatepicker className="esp-export-detail-period_datePicker" />
                </ESPFormControl>
              )}
            />
            <ESPTypography className="esp-export-detail-period_text">to</ESPTypography>
            <CustomController
              name="endPeriod"
              control={control}
              getValues={getValues}
              setError={setError}
              clearErrors={clearErrors}
              render={(params) => (
                <ESPFormControl variant="outlined" fullWidth required rhfParams={params}>
                  <ESPDatepicker className="esp-export-detail-period_datePicker" />
                </ESPFormControl>
              )}
            />
          </Box>
        </Box>

        <Box className="esp-export-detail-actions">
          <Box>
            <ESPButton
              color="secondary"
              onClick={() => {
                resetModal();
                onCloseModal(true);
              }}
            >
              Cancel
            </ESPButton>

            <ESPButton
              className="esp-export-detail-actions_submit"
              type="submit"
              data-testid="log-time-submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Export
            </ESPButton>
          </Box>
        </Box>
      </Box>
    );
  }
);

CustomController.displayName = 'CustomController';
ExportTimeLogDetailModal.displayName = 'ExportTimeLogDetailModal';
