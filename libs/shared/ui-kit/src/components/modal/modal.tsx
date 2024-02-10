'use client';

import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

import { DialogComponent, DialogTitleComponent } from './components';
import { ESPModalProps, TReasonOnClose } from './type';

export function ESPModal({
  title,
  children,
  actions,
  onClose,
  hideCloseIcon = false,
  closeIcon,
  ...props
}: ESPModalProps) {
  const handleClose = (event?: unknown, reason?: TReasonOnClose) => {
    if (typeof onClose === 'function') {
      onClose(reason);
    }
  };

  return (
    <DialogComponent scroll={'paper'} {...props} onClose={handleClose}>
      <DialogTitleComponent>
        {title || <div />}
        {!hideCloseIcon &&
          (closeIcon || (
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          ))}
      </DialogTitleComponent>
      <DialogContent dividers tabIndex={-1}>
        {children}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </DialogComponent>
  );
}

export default ESPModal;
