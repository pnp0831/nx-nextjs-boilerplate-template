import Slider, { SliderProps } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

export const SliderComponent = styled(Slider)<SliderProps>(({ theme }) => {
  return {
    '.MuiSlider-rail': {
      color: theme.palette.gray_medium.main,
    },
    '.MuiSlider-track ': {
      border: 'none',
    },
    '.MuiSlider-thumb': {
      border: '0.15rem solid white',
      width: '1.2rem',
      height: '1.2rem',
      '&:before': {
        boxShadow: 'none',
      },
    },
  };
});
