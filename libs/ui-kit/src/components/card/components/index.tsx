import Card, { CardProps } from '@mui/material/Card';
import { styled } from '@mui/material/styles';

export const CardComponent = styled(Card)<CardProps>(({ theme }) => {
  return {
    background: ' #FFFFFF',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    '.MuiCardActions-root': {
      padding: '0 1rem 1rem',
    },
    '.MuiCardContent-root': {
      padding: '1rem',
      ...theme.typography.regular_l,
      '&:last-child': {
        paddingBottom: '1rem',
      },
    },
    '.MuiCardHeader-root': {
      borderBottom: `1px solid ${theme.palette.gray_medium.main}`,
      padding: '0.75rem 1rem',
      ...theme.typography.h4,
      maxHeight: '3rem',

      '.MuiCardHeader-action': {
        margin: 0,

        '>.MuiIconButton-root': {
          marginTop: '-0.5rem',
          marginRight: '-0.5rem',
        },
      },
    },
  };
});
