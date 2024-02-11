import { LOADING_STATUS } from '@esp/contexts/import-export-notifier-context';
import Box from '@mui/material/Box';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CircleLoading = ({
  size = '3.125rem',
  status = LOADING_STATUS.INPROCESS_LOADING,
  overrideCircleColor,
  showNoLoading,
}: {
  size?: string;
  status?: LOADING_STATUS;
  overrideCircleColor?: string;
  showNoLoading?: boolean;
}) => {
  const linearGradientId = useRef(uuidv4()).current;

  const theme = useTheme();
  if (showNoLoading && status === LOADING_STATUS.NO_LOADING) {
    return (
      <Box className="circle-loading">
        <CircularProgress
          variant="determinate"
          sx={{
            color: '#EBEEF0',
          }}
          size={size}
          value={100}
          thickness={3}
        />

        <CircularProgress
          variant="determinate"
          value={100}
          sx={{
            color: overrideCircleColor || '#EBEEF0',
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          size={size}
          thickness={3}
        />
      </Box>
    );
  }

  if ([LOADING_STATUS.ERROR_LOADING, LOADING_STATUS.SUCCESS_LOADING].includes(status)) {
    const statusPalette = status === LOADING_STATUS.ERROR_LOADING ? 'error' : 'success';

    return (
      <Box className="circle-loading">
        <CircularProgress
          variant="determinate"
          sx={{
            color: '#EBEEF0',
          }}
          size={size}
          value={100}
          thickness={3}
        />

        <CircularProgress
          variant="determinate"
          value={100}
          sx={{
            color: (theme) => overrideCircleColor || theme.palette[statusPalette].main,
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          size={size}
          thickness={3}
        />
      </Box>
    );
  }

  if (status === LOADING_STATUS.INPROCESS_LOADING) {
    return (
      <Box className="circle-loading">
        <CircularProgress
          variant="determinate"
          sx={{
            color: '#EBEEF0',
          }}
          size={size}
          value={100}
          thickness={3}
        />

        <svg
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: size,
            height: size,
          }}
        >
          <linearGradient id={linearGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="20%" stopColor={overrideCircleColor || theme.palette.black.main} />
            <stop offset="70%" stopColor="#EBEEF0" />
          </linearGradient>
        </svg>

        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
              stroke: `url(#${linearGradientId})`,
            },
          }}
          size={size}
          thickness={3}
        />
      </Box>
    );
  }

  return null;
};
export default CircleLoading;
