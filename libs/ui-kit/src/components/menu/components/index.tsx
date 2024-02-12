import { Menu, MenuProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    overflowY: 'revert',
    borderRadius: '0.25rem',
    filter: 'drop-shadow(0px 4px 16px rgba(0, 0, 0, 0.16))',
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.black.main,
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: theme.palette.gray_light.main,
        color: theme.palette.primary.main,
      },
    },
    '& .MuiButtonBase-root': {
      borderRadius: '0.25rem',
      margin: '0 0.5rem',
    },
  },
}));
