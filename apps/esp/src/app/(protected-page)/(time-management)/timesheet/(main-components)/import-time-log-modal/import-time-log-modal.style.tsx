import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';

export const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.orange.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.orange.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    backgroundColor: theme.palette.gray_dark.main,
    borderRadius: 2,
    position: 'relative',
    top: 20,
  },
}));

export const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  [`&.${stepLabelClasses.root}`]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  [`& .${stepLabelClasses.iconContainer}`]: {
    padding: 0,
  },
  [`& .${stepLabelClasses.labelContainer}`]: {
    textAlign: 'center',
    marginTop: '0.5rem',
    color: theme.palette.mandate.main,
  },
}));

export const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean; error?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.gray_dark.main,
  zIndex: 1,
  color: '#fff',
  width: '2.5rem',
  height: '2.5rem',
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  ...(ownerState.active && {
    color: theme.palette.white.main,
    background: theme.palette.orange.main,
  }),
  ...(ownerState.completed && {
    color: theme.palette.white.main,
    background: theme.palette.orange.main,
  }),
  ...(ownerState.error && {
    color: theme.palette.white.main,
    background: theme.palette.error.main,
  }),
}));
