import { Option } from '@ui-kit/components/autocomplete';
import { ESPFormControlRhfParams } from '@ui-kit/components/form-control';
import { FieldValues } from 'react-hook-form';

export interface IOrganizationUnitOptions extends Option {
  isUnit?: boolean;
  isEmployee?: boolean;
  isManager?: boolean;

  email?: string;
  parentId?: string;
  parentName?: string;
  level?: number;

  belongToUnitName?: string;
}

export interface IOrganizationsSelectionProps<T extends FieldValues> {
  multiple?: boolean;
  rhfParams?: ESPFormControlRhfParams<T>;
  onChange?: (...params: unknown[]) => void;
  excludeUnit?: boolean;
  label?: string;

  // TODO: Remove after QA testing this feature.
  employeeIdDemo?: string;
}
