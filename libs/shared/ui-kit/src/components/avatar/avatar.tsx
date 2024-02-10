'use client';

import { SxProps, Theme } from '@mui/material/styles';
import { ImgHTMLAttributes } from 'react';

import { getAcronym } from '../../helpers/index';
import { ESPTypography } from '../typography/typography';
import { AvatarComponent, BadgeDot } from './components';
import { ESPAvatarProps } from './type';

export const ESPAvatar = ({ hasDot, ...props }: ESPAvatarProps) => {
  const imgProps: ImgHTMLAttributes<HTMLImageElement> & { sx?: SxProps<Theme> | undefined } = {
    loading: 'lazy',
  };

  const defaultPropChild = props.alt ? (
    <ESPTypography variant="bold_s">{getAcronym(props.alt)}</ESPTypography>
  ) : (
    <img src="/icons/avatar.png" alt="avatar" />
  );

  if (hasDot) {
    return (
      <BadgeDot
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <AvatarComponent {...props} imgProps={imgProps}>
          {defaultPropChild}
        </AvatarComponent>
      </BadgeDot>
    );
  }

  return (
    <AvatarComponent {...props} imgProps={imgProps}>
      {defaultPropChild}
    </AvatarComponent>
  );
};

export default ESPAvatar;
