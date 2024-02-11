import Box, { BoxProps } from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import { ESPTooltip } from '@ui-kit/components/tooltip';

const TaskStatusBox = styled(Box)<BoxProps & { color: string }>(({ color }) => ({
  background: color,
  width: '0.625rem',
  height: '0.625rem',
  borderRadius: '50%',
  marginRight: '0.5rem',
}));

export const TaskStatus = ({ status }: { status: number }) => {
  const theme = useTheme();

  const color =
    {
      0: theme.palette.black.main,
      1: theme.palette.mandate.main,
      2: theme.palette.success.main,
      3: theme.palette.black.main,
      4: theme.palette.black.main,
    }[status] || theme.palette.black.main;

  const title = {
    0: 'Not Started',
    1: 'In Progress',
    2: 'Done',
    3: 'Pending',
    4: 'Canceled',
  }[status];

  return (
    <ESPTooltip title={title} placement="left">
      <TaskStatusBox color={color} />
    </ESPTooltip>
  );
};
