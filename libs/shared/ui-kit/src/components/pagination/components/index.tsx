import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

import { ESPPaginationProps } from '../type';

export const PaginationComponent = styled(Pagination, {
  shouldForwardProp: (prop) => prop !== 'size',
})<Omit<ESPPaginationProps, 'size'>>(({ theme, size = 'large' }) => {
  const styles = {
    large: {
      button: {
        ...theme.typography.regular_l,
        height: '2rem',
        width: '2rem',
        minWidth: 'max-content',
        '&.Mui-selected': {
          ...theme.typography.bold_l,
        },
        svg: {
          width: '0.8em',
          height: '0.8em',
        },
      },
      padding: '0.25rem 0.25rem',
    },
    medium: {
      button: {
        ...theme.typography.regular_m,
        height: '1.5rem',
        width: '1.5rem',
        minWidth: 'max-content',
        '&.Mui-selected': {
          ...theme.typography.bold_m,
        },
        svg: {
          width: '0.75em',
          height: '0.75em',
        },
      },
      padding: '0.25rem 0.2rem',
    },
    small: {
      button: {
        ...theme.typography.regular_s,
        height: '1rem',
        width: '1rem',
        minWidth: 'max-content',
        '&.Mui-selected': {
          ...theme.typography.bold_s,
        },
        svg: {
          width: '0.625em',
          height: '0.625em',
        },
      },
      padding: '0.25rem 0.15rem',
    },
  }[size];

  return {
    border: `1px solid ${theme.palette.gray_medium.main}`,
    borderRadius: '0.25rem',
    width: 'max-content',
    ...styles,
    'ul li': {
      lineHeight: '0',
      button: {
        margin: 0,
        borderRadius: '0.25rem',
        border: `1px solid transparent`,
        color: theme.palette.common.black,
        '&.Mui-selected:hover': {
          backgroundColor: theme.palette.primary.main,
        },
        '&:hover': {
          border: `1px solid ${theme.palette.primary.main}`,
          backgroundColor: 'unset',
        },
        '&.Mui-disabled': {
          color: theme.palette.black_muted.main,
        },
      },
      '&:not(:last-child)': {
        marginRight: '0.5rem',
      },
    },
  };
});

export const PreviousButton = () => 'Previous';
export const NextButton = () => 'Next';
