import { ESPButton } from '@ui-kit/components/button';
import { ESPModal } from '@ui-kit/components/modal';
import React, { memo, MouseEventHandler, ReactNode } from 'react';

interface ESPConfirmModalProps {
  cancelText?: string;
  confirmText?: string;

  onCancel: MouseEventHandler<HTMLButtonElement> | undefined;
  onConfirm: MouseEventHandler<HTMLButtonElement> | undefined;
  onClose: () => void;

  open: boolean;

  title?: ReactNode;
  subTitle?: ReactNode;
  showCancelBtn?: boolean;
}

const ESPConfirmModal = memo(
  ({
    cancelText,
    confirmText,
    open,
    onClose,
    onCancel,
    onConfirm,
    subTitle,
    title,
    showCancelBtn = true,
  }: ESPConfirmModalProps) => {
    return (
      <ESPModal
        title={title}
        open={open}
        maxWidth={'xs'}
        fullWidth
        actions={
          <>
            {showCancelBtn ? (
              <ESPButton color="secondary" onClick={onCancel} sx={{ width: '7rem' }}>
                {cancelText || 'Cancel'}
              </ESPButton>
            ) : null}
            <ESPButton onClick={onConfirm} sx={{ width: '7rem' }}>
              {confirmText || 'Save Changes'}
            </ESPButton>
          </>
        }
        onClose={onClose}
      >
        {subTitle || 'Are you sure?'}
      </ESPModal>
    );
  }
);
ESPConfirmModal.displayName = 'ESPConfirmModal';
export default ESPConfirmModal;
