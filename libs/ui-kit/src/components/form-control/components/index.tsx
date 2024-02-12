import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

export const FormControlComponent = styled(FormControl)(({ theme }) => {
  return {
    '.MuiFormHelperText-root': {
      marginLeft: 0,
      marginRight: 0,
      marginTop: '0.5rem',
    },
    '.MuiFormLabel-root': {
      ...theme.typography.bold_l,
      color: theme.palette.common.black,
      marginBottom: '0.5rem',
      '.MuiFormLabel-asterisk': {
        color: theme.palette.error.main,
      },
      '&.Mui-focused, &.Mui-error': {
        color: theme.palette.common.black,
      },
    },
  };
});
