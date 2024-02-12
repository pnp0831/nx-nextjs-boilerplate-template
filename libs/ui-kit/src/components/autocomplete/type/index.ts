import { InputBaseProps } from '@mui/material';
import {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import { ReactNode } from 'react';

import { Size } from '../../../theme';

export interface Option {
  label: string | ReactNode;
  value: string | number;
  disabled?: boolean;
  allOption?: boolean;
}

type Multiple = boolean | undefined;
type DisableClearable = boolean | undefined;
type FreeSolo = boolean | undefined;
type ChipComponent = React.ElementType;

export interface ESPAutocompleteProps
  extends Omit<
    AutocompleteProps<Option, Multiple, DisableClearable, FreeSolo, ChipComponent>,
    'size' | 'options' | 'renderInput' | 'onChange'
  > {
  options: Option[];
  placeholder?: string;
  size?: Size;
  onChange?: (
    values: NonNullable<string | Option> | (string | Option)[] | null,
    _reason?: AutocompleteChangeReason,
    selectOption?: AutocompleteChangeDetails<Option> | undefined
  ) => void;
  errorMessage?: string;
  error?: boolean;
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  inputProps?: InputBaseProps['inputProps'];
}
