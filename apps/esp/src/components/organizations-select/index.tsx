import './index.scss';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckIcon from '@mui/icons-material/Check';
import { AutocompleteCloseReason } from '@mui/material/Autocomplete';
import { ESPAutocomplete } from '@ui-kit/components/autocomplete';
import { ESPAvatar } from '@ui-kit/components/avatar';
import { ESPFormControl } from '@ui-kit/components/form-control';
import { ESPNotAvaliable } from '@ui-kit/components/not-available';
import { ESPTypography } from '@ui-kit/components/typography';
import { getAcronym } from '@ui-kit/helpers';
import { memo, SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import {
  SPEC_CHAR_FOR_AVOID_DUPLICATE_UNIT_NAME,
  SPEC_CHAR_FOR_REPLACE,
  useGetUnits,
} from './organizations-select.helper';
import {
  IOrganizationsSelectionProps,
  IOrganizationUnitOptions,
} from './organizations-select.type';

const PLACE_HOLDER = 'Select teams or individual';

const OrganizationsSelection = memo(
  <T extends FieldValues>({
    multiple,
    rhfParams,
    onChange,
    excludeUnit,
    employeeIdDemo,
  }: IOrganizationsSelectionProps<T>) => {
    // TODO: Remove after QA testing this feature.
    const { loading: loadingUnits, optionUnits } = useGetUnits(employeeIdDemo as string);
    const options: IOrganizationUnitOptions[] = useMemo(
      () => (excludeUnit ? optionUnits.filter((o) => !o.isUnit) : optionUnits),
      [excludeUnit, optionUnits]
    );

    const [open, setOpen] = useState(false);

    const onOpen = () => setOpen(true);

    const onClose = (event: SyntheticEvent, reason: AutocompleteCloseReason) => {
      if (multiple) {
        if (reason === 'selectOption' || reason === 'removeOption') {
          return setOpen(true);
        }

        return setOpen(false);
      }

      return setOpen(false);
    };

    const handleOnChange = useCallback(
      (...params: unknown[]) => {
        if (!multiple) {
          setOpen(false);
        }

        if (onChange) {
          onChange(...params);
        }
      },
      [multiple, onChange]
    );

    const filterOptions = (
      options: IOrganizationUnitOptions[],
      { inputValue }: { inputValue: string }
    ) => {
      return options.filter(({ label, email }) => {
        return (
          String(label).toLowerCase().includes(inputValue) ||
          String(email).toLowerCase().includes(inputValue)
        );
      });
    };

    return (
      <>
        <ESPFormControl
          variant="outlined"
          label="For"
          fullWidth
          rhfParams={rhfParams}
          sx={{
            minWidth: '17rem',
          }}
          required
          onChange={handleOnChange}
        >
          <ESPAutocomplete
            noOptionsText={
              <ESPNotAvaliable className="esp-autocomplete-no-options" width={112} height={112} />
            }
            loading={loadingUnits}
            multiple={multiple}
            options={options}
            placeholder={PLACE_HOLDER}
            fullWidth
            limitTags={3}
            disableCloseOnSelect={!multiple}
            getOptionLabel={(option) => (option as IOrganizationUnitOptions).label as string}
            groupBy={(option) =>
              (option as unknown as IOrganizationUnitOptions).belongToUnitName as string
            }
            renderGroup={(params) => {
              if (!params.group) {
                return null;
              }

              const [divisionName, ...rest] = params.group.split(SPEC_CHAR_FOR_REPLACE);

              const divisionNameElm = (
                <ESPTypography variant="regular_m">
                  {divisionName.replaceAll(SPEC_CHAR_FOR_AVOID_DUPLICATE_UNIT_NAME, '')}
                </ESPTypography>
              );

              const teamEle = (
                <>
                  <ArrowForwardIosIcon className="esp-icon-forward" />
                  <ESPTypography variant="regular_m">{rest[rest.length - 1]}</ESPTypography>
                </>
              );

              let element = (
                <>
                  {divisionNameElm}
                  {rest.length !== 0 && teamEle}
                </>
              );

              if (rest.length > 1) {
                element = (
                  <>
                    {divisionNameElm}

                    <ArrowForwardIosIcon className="esp-icon-forward" />

                    <ESPTypography
                      variant="regular_m"
                      title={params.group.replaceAll(SPEC_CHAR_FOR_REPLACE, ' > ')}
                    >
                      ...
                    </ESPTypography>

                    {teamEle}
                  </>
                );
              }

              return (
                <li key={params.key} className="esp-group">
                  <div className="esp-group__header">{element}</div>
                  <ul className="esp-group__items">{params.children}</ul>
                </li>
              );
            }}
            renderOption={(props, initOption, a) => {
              const option = initOption as IOrganizationUnitOptions;

              return (
                <li
                  {...props}
                  key={`${option.label}-${option.value}`}
                  aria-disabled={option.disabled}
                  role="button"
                >
                  {option.isUnit && (
                    <ESPTypography variant="regular_m" component="span">
                      {option.label}
                    </ESPTypography>
                  )}
                  {option.isEmployee && (
                    <div className="esp-group__items--employee">
                      <ESPAvatar alt={getAcronym(option.label as string)} />
                      <div>
                        <ESPTypography variant="regular_s">{option.label}</ESPTypography>
                        <ESPTypography variant="regular_s">{option.email}</ESPTypography>
                      </div>
                    </div>
                  )}
                  {props['aria-selected'] && <CheckIcon />}
                </li>
              );
            }}
            forcePopupIcon={false}
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            clearOnBlur={false}
            filterOptions={filterOptions}
          />
        </ESPFormControl>
      </>
    );
  }
);

OrganizationsSelection.displayName = 'OrganizationsSelection';

export default OrganizationsSelection;
