import MUICheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import MUIRadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { styled } from '@mui/material/styles';

export const RadioButtonUncheckedIcon = styled((props) => (
  <MUIRadioButtonUncheckedIcon {...props} />
))(({ theme }) => {
  return {
    color: theme.palette.gray_dark.main,
  };
});

export const CheckBoxOutlineBlankIcon = styled((props) => (
  <MUICheckBoxOutlineBlankIcon {...props} />
))(({ theme }) => {
  return {
    color: theme.palette.black_muted.main,
  };
});
