'use client';

import Typography, { TypographyProps } from '@mui/material/Typography';

export const ESPTypography = (props: TypographyProps & { component?: string }) => {
  return (
    <Typography
      {...props}
      sx={{
        cursor: 'default',
        ...props.sx,
      }}
    />
  );
};

export default ESPTypography;
