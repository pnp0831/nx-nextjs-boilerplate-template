import { Tabs, TabsProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TabComponent = styled(Tabs)<TabsProps>(({ theme }) => {
  return {
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    background: theme.palette.gray_light.main,
    '.MuiTabs-incdicator': {
      backgroundColor: theme.palette.primary.main,
    },
    '.MuiButtonBase-root': {
      textTransform: 'none',
      color: theme.palette.black_muted.main,
      ...theme.typography.bold_l,

      '&.Mui-selected': {
        color: theme.palette.common.black,
        ...theme.typography.bold_l,
      },
    },
    '.esp-tabpanel': {
      borderBottomRightRadius: '0.5rem',
      borderBottomLeftRadius: '0.5rem',
    },
  };
});
