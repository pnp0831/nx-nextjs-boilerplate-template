import { Theme } from '@mui/material/styles';

export const popoverStyle = (theme: Theme) => ({
  // For time  picker
  '.time-picker': {
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottom: `1px solid ${theme.palette.white_muted.main}`,
    padding: '1rem 1.5rem',

    '.time-picker-input': {
      border: `1px solid ${theme.palette.common.black}`,
      borderRadius: '0.25rem',

      '.MuiInputBase-input': {
        color: theme.palette.common.black,
      },
    },

    '.MuiFormControl-root .MuiInputBase-root': {
      background: 'transparent',
      color: theme.palette.common.white,

      svg: {
        color: theme.palette.common.black,
        width: '1.2em',
      },
    },

    '.MuiAutocomplete-popper .MuiPaper-root.MuiPaper-elevation': {
      background: theme.palette.common.white,
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1), 0px 0px 10px rgba(0, 0, 0, 0.0001)',
      borderRadius: '0.25rem',

      '&:before': {
        backgroundColor: theme.palette.common.white,
      },

      ul: {
        color: theme.palette.common.black,
        padding: '0.5rem',
        position: 'relative',
        maxHeight: '20vh',
        minWidth: '7rem',

        'li.MuiAutocomplete-option': {
          ...theme.typography.regular_m,
          svg: {
            fontSize: '1.2em',
          },
          '&:hover, &[aria-selected="true"]:hover': {
            backgroundColor: theme.palette.gray_medium.main,
            color: theme.palette.primary.main,
          },
          '&[aria-selected="true"], &.Mui-selected': {
            backgroundColor: 'unset',
            color: theme.palette.primary.main,
          },
          '&[aria-disabled="true"], &[aria-disabled="true"]:hover': {
            opacity: 1,
            color: theme.palette.black_muted.main,
            cursor: 'not-allowed',
          },
        },
      },
    },
  },
});
