import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export const BadgeDot = styled(Badge)(({ theme }) => {
  return {
    '& .MuiAvatar-root': {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    '& .MuiBadge-badge': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.main,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
  };
});

export const AvatarComponent = styled(Avatar)(({ theme }) => {
  return {
    '&.MuiAvatar-root': {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
  };
});
