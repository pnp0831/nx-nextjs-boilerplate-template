import { TextFieldProps } from '@mui/material';

import { ESPAutocompleteProps, Option } from '../../autocomplete/type/index';
import { ILoadOptions } from '../../table/type/index';

export interface ESPAutocompleteEnhancementProps
  extends Omit<ESPAutocompleteProps, 'onChange' | 'renderInput'> {
  onChange?: (value: NonNullable<string | Option> | (string | Option)[] | null) => void;
  renderInput?: (param: TextFieldProps) => JSX.Element;
  seachingLocal?: boolean;
  loadData?: (params?: ILoadOptions) => void;
}
