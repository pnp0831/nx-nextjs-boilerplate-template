'use client';

import './import-export-notifier.scss';

import CircleLoading from '@esp/components/circle-loading';
import { APP_ROUTE, IMPORT_EXPORT_ICON_PARAM } from '@esp/constants';
import {
  FLOW_STATUS,
  LOADING_STATUS,
  ModalType,
  useImportExportNotifier,
} from '@esp/contexts/import-export-notifier-context';
import { ISignalRMessages, useSignalRContext } from '@esp/contexts/signalr-context';
import { bytesToSize } from '@esp/utils/helper';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { IconButton } from '@mui/material';
import { Box, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ESPBadge } from '@ui-kit/components/badge';
import { ESPTypography } from '@ui-kit/components/typography';
import { hexToRgb } from '@ui-kit/helpers';
import useWindowResize from '@ui-kit/hooks/useWindowResize';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const ImportExportNotifier = memo(() => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const router = useRouter();

  const {
    dataModal,
    updateDataModalById,
    updateDataByProgressId,
    removeModalById,
    setTargetIcon,
    getIconStatus,
    countBadgeInProcess,
    shouldDisplayLoadingIcon,
  } = useImportExportNotifier();

  const shouldDisplayIcon = shouldDisplayLoadingIcon();

  useEffect(() => {
    if (!shouldDisplayIcon && open) {
      handleClose();
    }
  }, [shouldDisplayIcon, open, handleClose]);

  const { signalRConnection } = useSignalRContext();

  useEffect(() => {
    if (signalRConnection) {
      signalRConnection.on('Notification', (message: ISignalRMessages) => {
        if ([ModalType.TIME_LOG_EXPORT, ModalType.TIME_LOG_IMPORT].includes(message.type)) {
          updateDataByProgressId(
            message.progressId,
            message.isSuccess ? LOADING_STATUS.SUCCESS_LOADING : LOADING_STATUS.ERROR_LOADING
          );
        }
      });
    }
  }, [signalRConnection, updateDataByProgressId]);

  const refIcon = useRef<HTMLButtonElement | null>();

  useWindowResize(() => {
    if (refIcon.current && typeof setTargetIcon === 'function') {
      setTargetIcon(refIcon.current);
    }
  });

  const iconStatus = getIconStatus();

  const iconColor = useMemo(() => {
    const color = {
      [LOADING_STATUS.ERROR_LOADING]: theme.palette.error.main,
      [LOADING_STATUS.SUCCESS_LOADING]: theme.palette.success.main,
      [LOADING_STATUS.INPROCESS_LOADING]: theme.palette.black.main,
      [LOADING_STATUS.NO_LOADING]: theme.palette.black.main,
    }[iconStatus];

    return color;
  }, [iconStatus, theme.palette.black.main, theme.palette.error.main, theme.palette.success.main]);

  const convertFileSize = useCallback((fileSize: number) => {
    return bytesToSize(fileSize * 1024 * 1024);
  }, []);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          borderRadius: '50%',
          background: 'white',
          marginRight: '1rem',
          visibility: shouldDisplayIcon ? 'visible' : 'hidden',
        }}
        size="small"
        className="import-export-notifier-icon"
        ref={(ref) => (refIcon.current = ref)}
      >
        <ESPBadge badgeContent={countBadgeInProcess()}>
          <CircleLoading size="1.75rem" status={iconStatus} />
          <ImportExportIcon
            sx={{
              fontSize: '1.5rem',
              color: iconColor,
            }}
          />
        </ESPBadge>
      </IconButton>

      <Popover
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disablePortal
        disableScrollLock={true}
        slotProps={{
          paper: {
            sx: {
              maxHeight: '31rem',
              overflowY: 'auto',
              padding: '0.6rem 0.5rem 0.75rem 0.5rem',
              width: '22rem',
              mt: 0.5,
              bgcolor: theme.palette.common.white,
              position: 'relative',
              heght: '100%',
              borderRadius: '4px',
              boxShadow:
                '0px 0px 10px 0px rgba(0, 0, 0, 0.00), 0px 8px 16px 0px rgba(0, 0, 0, 0.10)',

              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 12,
                width: '0.5rem',
                height: '0.5rem',
                bgcolor: theme.palette.common.white,
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
              '> div': {
                padding: '0.3rem',
                marginBottom: '0.6rem',
                cursor: 'pointer',
                '&:last-of-type': {
                  marginBottom: '0',
                },

                '&:hover': {
                  bgcolor: theme.palette.gray_light.main,
                  borderRadius: '0.25rem',
                },
              },

              '> div >div': {
                color: theme.palette.common.black,
                ul: {
                  padding: 0,
                  margin: 0,
                  li: {
                    padding: '0.5rem',

                    hr: {
                      borderColor: theme.palette.mandate.main,
                      margin: '0.5rem',
                    },
                  },
                },
              },
            },
          },
        }}
      >
        {Object.entries(dataModal || {}).map(
          ([_, { fileName, type, modalId, status, flowStatus, fileSize, formData }]) => {
            const color = {
              [LOADING_STATUS.ERROR_LOADING]: theme.palette.error.main,
              [LOADING_STATUS.SUCCESS_LOADING]: theme.palette.success.main,
              [LOADING_STATUS.INPROCESS_LOADING]: theme.palette.black.main,
            }[status as number];

            if (typeof status === 'undefined' || status === LOADING_STATUS.NO_LOADING) {
              return null;
            }

            const fileSizeAsNode = fileSize ? (
              <>
                <FiberManualRecordIcon sx={{ margin: '0 0.375rem', fontSize: '0.5rem' }} />
                {convertFileSize(fileSize as number)}
              </>
            ) : null;

            return (
              <Box
                key={modalId}
                sx={{ paddingBottom: '0.6rem' }}
                onClick={() => {
                  if (status === LOADING_STATUS.INPROCESS_LOADING) {
                    return updateDataModalById(modalId, {
                      open: true,
                      isModalInProgress: true,
                    });
                  }

                  if (type === ModalType.TIME_LOG_EXPORT) {
                    removeModalById(modalId);
                    return router.replace(`${APP_ROUTE.EXPORT}&${IMPORT_EXPORT_ICON_PARAM}=true`);
                  }

                  if (type === ModalType.TIME_LOG_IMPORT) {
                    if (
                      status === LOADING_STATUS.ERROR_LOADING &&
                      flowStatus === FLOW_STATUS.WARNING
                    ) {
                      return updateDataModalById(modalId, {
                        type,
                        open: true,
                      });
                    }

                    removeModalById(modalId);
                    return router.replace(`${APP_ROUTE.IMPORT}&${IMPORT_EXPORT_ICON_PARAM}=true`);
                  }
                }}
              >
                <Box display="flex" alignItems="center" className="import-export-notifier-wrapper">
                  <IconButton
                    size="medium"
                    className="import-export-notifier-icon"
                    sx={{
                      marginRight: '0.5rem',
                      background: 'white',
                      ':hover': {
                        background: 'white',
                      },
                    }}
                  >
                    <CircleLoading size="2rem" status={status} />
                    <ImportExportIcon
                      sx={{
                        position: 'absolute',
                        top: '6%',
                        width: '1.5rem',
                        height: '1.5rem',
                        fontSize: '1.5rem',
                        color,
                      }}
                    />
                  </IconButton>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ESPTypography
                      variant="regular_m"
                      sx={{
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        WebkitLineClamp: '2',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word',
                      }}
                    >
                      {fileName || formData?.fileName}
                    </ESPTypography>
                    <ESPTypography
                      variant="regular_s"
                      display="flex"
                      alignItems="center"
                      sx={{
                        fontStyle: 'italic',
                        color: hexToRgb(theme.palette.black_muted.main, 0.4),
                        lineHeight: 'normal',
                      }}
                    >
                      {type}
                      {fileSizeAsNode}
                    </ESPTypography>
                  </Box>
                </Box>
              </Box>
            );
          }
        )}
      </Popover>
    </>
  );
});

ImportExportNotifier.displayName = 'ImportExportNotifier';

export default ImportExportNotifier;
