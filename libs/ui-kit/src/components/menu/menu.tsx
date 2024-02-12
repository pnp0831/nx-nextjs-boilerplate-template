'use client';

import './menu.scss';

import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

import { ESPButton } from '../button';
import { StyledMenu } from './components';
import { ESPMenuProps, ListContentData } from './type';

export function ESPMenu({
  buttonLabel,
  startIcon,
  listContent,
  styleButton,
  colorButton,
}: ESPMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = (item: ListContentData) => {
    handleClose();

    if (typeof item.onClick === 'function') {
      item.onClick();
    }
  };

  return (
    <div>
      <ESPButton
        color={colorButton}
        aria-haspopup="true"
        variant="contained"
        disableElevation
        onClick={handleClick}
        startIcon={startIcon}
        sx={styleButton}
      >
        {buttonLabel}
      </ESPButton>
      <StyledMenu className="esp-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        {listContent?.map((item) => {
          return (
            <MenuItem key={item.label} onClick={() => handleClickItem(item)} disableRipple>
              {item.label}
            </MenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );
}

export default ESPMenu;
