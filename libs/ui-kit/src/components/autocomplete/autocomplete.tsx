'use client';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Autocomplete, { AutocompleteChangeReason } from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import useWindowResize from '@ui-kit/hooks/useWindowResize';
import loOmit from 'lodash/omit';
import { forwardRef, Fragment, useEffect, useRef, useState } from 'react';

import { hexToRgb } from '../../helpers/index';
import { LoadingComponent } from '../autocomplete-enhancement/components';
import { ESPNotAvaliable } from '../not-available';
import { ESPTag } from '../tag';
import { ESPTextField } from '../text-field/text-field';
import { ESPTooltip } from '../tooltip';
import { ESPTypography } from '../typography';
import { ESPAutocompleteProps, Option } from './type';

export const getLimitTags = (size: number) => {
  switch (true) {
    case size > 500:
      return 4;
    case size > 450:
      return 3;
    case size > 400:
      return 2;
    case size > 350:
      return 1;
    default:
      return 1;
  }
};

export const ESPAutocomplete = forwardRef(
  (
    {
      size = 'medium',
      placeholder = 'Autocomplete',
      options = [],
      limitTags: initLimitTags,
      onChange,
      loading,
      errorMessage,
      multiple,
      value: initValue,
      inputProps,
      ...props
    }: ESPAutocompleteProps,
    _ref
  ) => {
    const refOnChange = useRef(false);
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const autocompleteRef = useRef<HTMLDivElement | null>(null);

    const [limitTags, setLimitTags] = useState(initLimitTags);

    useWindowResize(() => {
      const newLimitTags = getLimitTags(autocompleteRef.current?.offsetWidth as number);

      if (newLimitTags !== limitTags) {
        setLimitTags(newLimitTags);
      }
    });

    const [value, setValue] = useState<Option[] | Option | null>(() => {
      if (initValue) {
        return initValue as Option[] | Option | null;
      }

      return multiple ? [] : null;
    });

    useEffect(() => {
      if (initValue) {
        setValue(initValue as Option[] | Option | null);
      }
    }, [initValue]);

    useEffect(() => {
      if (typeof onChange === 'function' && refOnChange.current) {
        onChange(value);
      }
    }, [value, onChange]);

    const handleOnChange = (
      values: NonNullable<string | Option> | (string | Option)[] | null,
      reason: AutocompleteChangeReason,
      selectOption: Option
    ) => {
      if (multiple) {
        const tmpValues = [...((values as Option[]) || [])] as Option[];
        if (reason === 'selectOption' && selectOption.allOption) {
          return setValue([selectOption]);
        }

        if (
          reason === 'selectOption' &&
          !selectOption.allOption &&
          tmpValues.some((i) => i.allOption)
        ) {
          return setValue(tmpValues.filter((i) => !i.allOption));
        }

        return setValue(tmpValues);
      }

      return setValue(values as Option);
    };

    return (
      <Autocomplete
        ref={autocompleteRef}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        options={options}
        open={open}
        onOpen={() => {
          setOpen(!open);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(_, values, reason, selectOption) => {
          refOnChange.current = true;
          handleOnChange(values, reason, selectOption?.option as unknown as Option);
        }}
        autoHighlight
        fullWidth
        disablePortal={false}
        sx={{
          '.MuiAutocomplete-inputRoot .MuiAutocomplete-input': {
            minWidth: '3rem',
          },
          ...props.sx,
        }}
        loading={loading}
        loadingText={<LoadingComponent />}
        popupIcon={props.popupIcon || <KeyboardArrowDownIcon />}
        renderOption={(props, option: Option, { inputValue }) => {
          return (
            <li
              {...props}
              key={`${option.label}-${option.value}`}
              aria-disabled={option.disabled}
              role="button"
            >
              {option.label}
              {props['aria-selected'] && <CheckIcon />}
            </li>
          );
        }}
        renderInput={(params) => {
          return (
            <ESPTextField
              {...params}
              inputProps={{
                ...params.inputProps,
                ...inputProps,
              }}
              ownerState={{
                error: props.error,
                errorMessage,
              }}
              size={size}
              placeholder={placeholder}
            />
          );
        }}
        {...loOmit(props, ['value', 'error'])}
        slotProps={{
          paper: {
            sx: {
              width: 'max-content',
              minWidth: '100%',
              minHeight: '10rem',
              mt: 1.5,
              bgcolor: theme.palette.common.white,
              maxHeight: '50vh',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: '0.75rem',
                right: '0.875rem',
                width: '0.5rem',
                height: '0.5rem',
                bgcolor: theme.palette.common.white,
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },

              '.MuiAutocomplete-noOptions': {
                color: hexToRgb(theme.palette.black_muted.main, 0.4),
              },
              ul: {
                color: 'common.white',
                padding: '0.5rem',
                // position: 'relative',
                margin: 0,

                'li.MuiAutocomplete-option': {
                  borderRadius: '0.25rem',
                  padding: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: theme.palette.common.black,
                  '&[aria-selected="true"]': {
                    '&.Mui-focused': {
                      background: 'transparent',
                    },
                  },
                  '&.Mui-focused': {
                    background: 'transparent',
                  },
                  '&:hover, &[aria-selected="true"]:hover': {
                    backgroundColor: theme.palette.gray_light.main,
                    color: theme.palette.primary.main,
                  },
                  '&[aria-selected="true"], &.Mui-selected': {
                    background: 'transparent',
                    color: theme.palette.primary.main,
                  },

                  '&[aria-disabled="true"], &[aria-disabled="true"]:hover': {
                    opacity: 1,
                    color: hexToRgb(theme.palette.black_muted.main, 0.4),
                    cursor: 'not-allowed',
                  },
                },
              },
            },
          },
          ...props.slotProps,
        }}
        renderTags={(values, getTagProps) => {
          let tmpValues = [...values];
          let limitTagText;

          if (typeof limitTags !== 'undefined' && limitTags !== -1) {
            const more = tmpValues.length - limitTags;
            if (more > 0) {
              tmpValues = tmpValues.splice(0, limitTags);

              limitTagText = (
                <ESPTooltip
                  placement="right"
                  key="tooltip"
                  title={
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {values.map((value, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <ESPTag
                            key={`${index}-${key}-limitTag`}
                            label={value.label}
                            size="small"
                            autocomplete
                            sx={{
                              color: 'common.black',
                              maxWidth: '6.25rem',
                            }}
                            deleteIcon={<ClearIcon fontSize="small" />}
                            {...tagProps}
                          />
                        );
                      })}
                    </div>
                  }
                >
                  <ESPTypography variant="bold_s" sx={{ marginLeft: '0.25rem' }} data-testid="more">
                    +{more}
                  </ESPTypography>
                </ESPTooltip>
              );
            }
          }

          return (
            <div style={{ display: 'flex' }} key={'renderTags'}>
              {tmpValues.map((value, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Fragment key={`${index}-${key}-initTag`}>
                    <ESPTag
                      label={value.label}
                      size="small"
                      autocomplete
                      deleteIcon={<ClearIcon fontSize="small" />}
                      {...tagProps}
                      sx={{
                        color: 'common.black',
                        '&.MuiAutocomplete-tag': {
                          maxWidth: '6rem',
                        },
                      }}
                    />
                  </Fragment>
                );
              })}
              {<Fragment key="limit-tag">{limitTagText}</Fragment>}
            </div>
          );
        }}
        multiple={multiple}
        value={value}
        noOptionsText={
          <ESPNotAvaliable
            className="esp-autocomplete-no-options"
            width={112}
            height={112}
            text="No Options"
          />
        }
      />
    );
  }
);

ESPAutocomplete.displayName = 'ESPAutocomplete';

export default ESPAutocomplete;
