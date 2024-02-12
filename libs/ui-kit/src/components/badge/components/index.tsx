import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export const BadgeComponent = styled(Badge)<BadgeProps>(({ theme, variant }) => {
  if (variant === 'dot') {
    return {
      '.MuiBadge-badge': {
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
        top: '-0.1rem',
        right: '-0.1rem',
      },
    };
  }

  return {
    '.MuiBadge-badge': {
      width: '1.25rem',
      height: '1.25rem',
      boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
      top: '-0.25rem',
      right: '-0.25rem',
      ...theme.typography.bold_s,
      fontSize: '0.625rem',
    },
  };
});
