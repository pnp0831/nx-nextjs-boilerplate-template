'use client';

import './notification.scss';

import {
  getNotification,
  getNotificationUnmark,
  IDataNotification,
  markNotifcation,
} from '@esp/apis/notification';
import { APP_ROUTE, DEFAULT_SKIP, DEFAULT_TAKE } from '@esp/constants';
import { ISignalRMessages, useSignalRContext } from '@esp/contexts/signalr-context';
import useAuth from '@esp/hooks/useAuth';
import Link from '@esp/libs/next-link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Divider, Popover } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { VirtualScrollingComponent } from '@ui-kit/components/autocomplete-enhancement/components';
import { ESPBadge } from '@ui-kit/components/badge';
import { ESPNotAvaliable } from '@ui-kit/components/not-available';
import { ESPTypography } from '@ui-kit/components/typography';
import { useNotify } from '@ui-kit/contexts/notify-context';
import { hexToRgb } from '@ui-kit/helpers';
import usePrevious from '@ui-kit/hooks/usePrevious';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const triggerDownload = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const Notification = memo(({ isUnitTesting }: { isUnitTesting?: boolean }) => {
  const { signalRConnection } = useSignalRContext();
  const theme = useTheme();
  const [notificationUnmark, setNotificationUnmark] = useState(0);
  const { notifySuccess } = useNotify();
  const router = useRouter();

  const checkMount = useRef(false);

  const { user } = useAuth();

  useEffect(() => {
    async function getDataNotificationUnmark(userId: string) {
      try {
        const { data } = await getNotificationUnmark(userId as string);

        setNotificationUnmark(data);
      } catch {
        //
      }
    }

    if (user?.id) {
      getDataNotificationUnmark(user.id);
    }
  }, [user?.id]);

  const [pageOptions, setPageOptions] = useState<{ skip: number; take: number }>({
    skip: DEFAULT_SKIP,
    take: DEFAULT_TAKE,
  });

  const { data, isFetching } = useQuery({
    queryKey: ['notification', pageOptions, user?.id],
    queryFn: () => {
      return getNotification({ ...pageOptions, userId: user?.id as string });
    },
    keepPreviousData: true,
  });

  const [dataMessages, setDataMessages] = useState<IDataNotification[]>([]);
  const [hasLoadMore, setHasLoadMore] = useState(true);

  const loadData = () => {
    setPageOptions((pageOptions) => ({
      ...pageOptions,
      skip: pageOptions.skip + pageOptions.take,
    }));
  };

  useEffect(() => {
    if (!data) {
      setHasLoadMore(false);
    }

    if (data?.data) {
      const condition = !isUnitTesting ? true : !checkMount.current;
      if (condition) {
        setHasLoadMore(data?.data?.length === pageOptions.take ? true : false);

        setDataMessages((oldData) => [...oldData, ...data.data]);
      }

      checkMount.current = true;
    }
  }, [data, pageOptions.take, isUnitTesting]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onReceiveMessage = useCallback(
    ({ message }: { message: ISignalRMessages }) => {
      const newMessage = {
        ...message,
        id: uuidv4(),
      } as unknown as IDataNotification;

      const { pathname } = location;

      if (newMessage.downloadAttachmentUrl && newMessage.type === 'Attendance Log Export') {
        if (pathname === APP_ROUTE.ADMINISTRATIVE_TOOLS) {
          triggerDownload(newMessage.downloadAttachmentUrl);
        } else {
          notifySuccess(
            <div>
              {newMessage.message}.
              <Link className="message-link" href={APP_ROUTE.EXPORT}>
                Go To Export History
              </Link>
            </div>
          );
        }
      }

      setDataMessages((oldData) => [newMessage, ...oldData]);

      setNotificationUnmark((count) => count + 1);
    },
    [setDataMessages, setNotificationUnmark, notifySuccess]
  );

  useEffect(() => {
    if (signalRConnection) {
      signalRConnection.on('Notification', (message: ISignalRMessages) => {
        onReceiveMessage({ message });
      });
    }
  }, [signalRConnection, onReceiveMessage]);

  const handleOnMark = (id: string) => {
    const tmpDataMessages = [...dataMessages];
    markNotifcation(id);

    const index = tmpDataMessages.findIndex((i) => i.id === id);

    if (index !== -1) {
      tmpDataMessages.splice(index, 1, { ...tmpDataMessages[index], isMarked: true });
    }

    setDataMessages(tmpDataMessages);
    setNotificationUnmark((count) => count - 1);
  };

  const previousLoading = usePrevious(isFetching);

  const isShowEmptyData =
    typeof previousLoading !== 'undefined' && !isFetching && !dataMessages.length;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          borderRadius: '50%',
          background: 'white',
          marginRight: '1rem',
        }}
        size="small"
      >
        <ESPBadge badgeContent={notificationUnmark}>
          <NotificationsIcon fontSize="small" />
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
              width: '22rem',
              mt: 1.5,
              bgcolor: theme.palette.common.white,
              position: 'relative',
              overflow: 'visible',
              heght: '100%',
              borderRadius: '0.25rem',
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

              '> div >div': {
                color: theme.palette.common.black,
                minHeight: '10rem',
                maxHeight: '25rem',
                ul: {
                  padding: 0,
                  margin: 0,
                  li: {
                    padding: '0.5rem',

                    hr: {
                      borderColor: hexToRgb(theme.palette.black_muted.main, 0.4),
                      margin: '0.5rem 0',
                    },
                  },
                },
              },
            },
          },
        }}
      >
        {isShowEmptyData && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          >
            <ESPNotAvaliable width={90} height={90} />
          </Box>
        )}
        <VirtualScrollingComponent
          itemSize={70}
          loadData={loadData}
          hasLoadMore={hasLoadMore}
          loading={isFetching}
        >
          {dataMessages.map((item, index) => {
            return (
              <li key={item.id}>
                <Box
                  sx={{ minHeight: 70 }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  onClick={() => {
                    if (!item.isMarked) {
                      handleOnMark(item.id);
                    }

                    if (item.type === 'Attendance Log Export') {
                      router.push(APP_ROUTE.EXPORT);
                    }

                    if (item.type === 'Time Log Import') {
                      router.push(APP_ROUTE.IMPORT);
                    }
                  }}
                >
                  <ESPTypography
                    variant="regular_l"
                    sx={{
                      overflow: 'hidden',
                      WebkitLineClamp: '2',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word',
                      color: item.isMarked
                        ? hexToRgb(theme.palette.black_muted.main, 0.4)
                        : theme.palette.common.black,
                    }}
                  >
                    {item.message}
                  </ESPTypography>
                  {index !== dataMessages.length - 1 && <Divider />}
                </Box>
              </li>
            );
          })}
        </VirtualScrollingComponent>
      </Popover>
    </>
  );
});

Notification.displayName = 'Notification';

export default Notification;
