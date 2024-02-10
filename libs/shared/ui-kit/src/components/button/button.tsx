'use client';

import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';

import { ButtonComponent, IconButtonComponent } from './components';
import { ESPButtonProps } from './type';

export const ESPButton = (props: ESPButtonProps) => {
  const iconOnly = typeof props.children === 'undefined';

  if (iconOnly) {
    const { startIcon, endIcon, disableElevation, loading, ...rest } = props;
    return (
      <IconButtonComponent {...rest} edge="start">
        {startIcon || endIcon}
      </IconButtonComponent>
    );
  }

  const { loading, children, onClick, disabled, ...rest } = props;

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      return;
    }

    if (typeof onClick === 'function') {
      return onClick(e);
    }
  };

  return (
    <ButtonComponent
      variant="contained"
      {...rest}
      loading={loading}
      className={clsx(props.className, {
        'Mui-loading': loading,
      })}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {loading && <CircularProgress size={20} />}
      {children}
    </ButtonComponent>
  );
};

export default ESPButton;
