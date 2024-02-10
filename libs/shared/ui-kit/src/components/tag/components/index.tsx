import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import { ESPChipProps } from '../type';

export const ChipComponent = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'autocomplete',
})<ESPChipProps>(({ theme, color = 'default', autocomplete }) => {
  const autoCompleteStyle = {
    height: autocomplete ? '1.5rem' : '1.25rem',
    margin: '0.25rem',
    background: autocomplete ? theme.palette.gray_dark.main : theme.palette[color].main,
    'svg.MuiSvgIcon-root': {
      color: theme.palette.black.main,
    },
    color: color ? theme.palette.common.white : '#110F2466',
  };

  return {
    borderRadius: '0.25rem',
    ...theme.typography.bold_s,
    '.MuiChip-label': {
      padding: '0.1rem 0.5rem',
    },
    '.MuiChip-deleteIcon': {
      fontSize: '1em',
    },
    ...autoCompleteStyle,
  };
});
