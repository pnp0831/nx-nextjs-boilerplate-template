import './index.scss';
import './index.scss';

import Box from '@mui/material/Box';
import clsx from 'clsx';
import Image from 'next/image';
import { memo } from 'react';

import { ESPTypography } from '../typography';
import { IESPNotAvaliable } from './type';

export const ESPNotAvaliable = memo(
  ({ text = 'No Data Avaliable', className, width, height }: IESPNotAvaliable) => {
    return (
      <Box className={clsx(className, 'esp-not-avaliable')}>
        <Image src="/images/not-available.gif" width={width} height={height} alt="no-data" />
        {text && (
          <ESPTypography variant="bold_m" component="p">
            {text}
          </ESPTypography>
        )}
      </Box>
    );
  }
);

export default ESPNotAvaliable;
