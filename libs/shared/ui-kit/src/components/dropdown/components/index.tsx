import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

import { IStyledCSSProperties } from '../../../theme';
import { ESPDropdownProps } from '../type';

export const SelectComponent = styled(
  ({ link, options, size, ...props }: ESPDropdownProps) => <Select {...props} />,
  {
    shouldForwardProp: (prop) => prop !== 'success' && prop !== 'link',
  }
)(({ theme, size = 'large', success = false, error = false, link = false }) => {
  const styles = {
    large: {
      height: '2.5rem',
      '> div': {
        ...theme.typography[link ? 'bold_l' : 'regular_l'],
      },
    },
    medium: {
      height: '2rem',
      '> div': {
        ...theme.typography[link ? 'bold_m' : 'regular_m'],
      },
    },
    small: {
      height: '1.5rem',
      '> div': {
        ...theme.typography[link ? 'bold_s' : 'regular_s'],
      },
    },
  }[size] as IStyledCSSProperties;

  const overrideStyles: IStyledCSSProperties = {};

  if (link) {
    overrideStyles['div[role="button"]'] = {
      paddingLeft: 0,
      paddingRight: 0,
    };
  }

  return {
    ...styles,
    ...overrideStyles,
    backgroundColor: !link ? theme.palette.gray_light.main : 'unset',
    '&.MuiInputBase-root': {
      fieldset: {
        borderRadius: '0.25rem',
        border: `0.0625rem solid ${
          success ? theme.palette.success.main : theme.palette.gray_medium.main
        }`,
        borderWidth: success || error ? '0.125rem' : '0.0625rem',
        display: link && 'none',
      },
      '&:hover fieldset': {
        borderColor: success
          ? theme.palette.success.main
          : error
          ? theme.palette.error.main
          : theme.palette.primary.main,
      },
      '&.Mui-disabled fieldset, &:hover&.Mui-disabled fieldset': {
        borderColor: theme.palette.gray_medium.main,
      },
    },
    '.MuiSelect-select': {
      alignItems: 'center',
      display: 'flex',
      '.MuiStack-root': {
        alignItems: 'center',
      },
      svg: {
        display: 'none',
      },
    },
  };
});
