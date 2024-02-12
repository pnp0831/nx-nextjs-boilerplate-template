import { FormControlLabel, FormControlLabelProps } from '@mui/material';
import loOmit from 'lodash/omit';
import { forwardRef, memo } from 'react';

export interface ESPFormControlLabelProps extends FormControlLabelProps {
  errorMessage?: string;
  error?: boolean;
}

const ESPFormControlLabelComponent = memo((props: ESPFormControlLabelProps) => {
  return <FormControlLabel {...loOmit(props, ['errorMessage', 'error'])} />;
});

export const ESPFormControlLabel = forwardRef<unknown, ESPFormControlLabelProps>(
  (props: ESPFormControlLabelProps, _ref) => {
    return <ESPFormControlLabelComponent {...props} />;
  }
);

export default ESPFormControlLabel;

ESPFormControlLabel.displayName = 'ESPFormControlLabel';
