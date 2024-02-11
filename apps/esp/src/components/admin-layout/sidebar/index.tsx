'use client';

import './index.scss';

import { dataLayerPush } from '@esp/components/google-analyze';
import { APP_ROUTE } from '@esp/constants';
import { useAppContext } from '@esp/contexts/app-context';
import useAuth from '@esp/hooks/useAuth';
import Link from '@esp/libs/next-link';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LogoutIcon from '@mui/icons-material/Logout';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ESPAvatar } from '@ui-kit/components/avatar';
import { ESPTooltip } from '@ui-kit/components/tooltip';
import { ESPTypography } from '@ui-kit/components/typography';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { CollapseComponent, DrawerComponent, DrawerMediumScreen, WrapperAvatar } from './styles';

const Avatar = memo(({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const { user = {} } = useAuth();

  return (
    <WrapperAvatar
      className="sidebar--avatar"
      open={sidebarOpen}
      onClick={() => {
        dataLayerPush({ event_name: 'click_avatar' });
      }}
    >
      <ESPAvatar hasDot alt={user.name as string} src={user.image as string} />
      {sidebarOpen && (
        <>
          <ESPTypography variant="bold_l">{user.name}</ESPTypography>
          <ESPTypography variant="regular_m">{user.role}</ESPTypography>
        </>
      )}
    </WrapperAvatar>
  );
});

Avatar.displayName = 'Avatar';

interface Menu {
  icon: React.ReactNode;
  name: string;
  href?: string;
  children?: Children[];
}

interface Children {
  name?: string;
  href?: string;
  hideArrow?: boolean;
  divider?: boolean;
  icon?: React.ReactNode;
}

type Menus = Menu[];

const MENUS: Menus = [
  {
    icon: <HomeIcon />,
    name: 'Dashboard',
    href: APP_ROUTE.HOME,
  },
  {
    icon: <TimelapseIcon />,
    name: 'Time Management',
    children: [
      {
        name: 'Timesheet',
        href: APP_ROUTE.TIME_SHEET,
      },
      {
        divider: true,
      },
      {
        name: 'Administrative Tools',
        href: APP_ROUTE.ADMINISTRATIVE_TOOLS,
      },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: 'Report',
    children: [
      {
        name: 'Import & Export',
        href: APP_ROUTE.IMPORT_EXPORT,
      },
    ],
  },
  {
    icon: <SettingsIcon />,
    name: 'Setting',
    children: [
      {
        name: 'Theme Color',
        href: '/1',
      },
      {
        name: 'Account Setting',
        href: '/2',
      },
      {
        name: 'Support Forum',
        href: '/3',
      },
      {
        name: 'Logout',
        icon: <LogoutIcon fontSize="small" />,
        hideArrow: true,
      },
    ],
  },
];

const Sidebar = memo(() => {
  const { sidebarOpen, sidebarWidth, sidebarOpenWidth, toggleSidebarMobile, sidebarMobileOpen } =
    useAppContext();
  const pathname = usePathname();

  const [openCollapse, setOpenCollapse] = useState<{ [key: string]: number | boolean }>(() => {
    const activeMenu = MENUS.find(
      ({ children }) => children?.length && children?.some((item) => item.href === pathname)
    );

    if (activeMenu) {
      return {
        [activeMenu.name]: true,
      };
    }

    return {};
  });

  const { signOut } = useAuth();

  useEffect(() => {
    if (!sidebarOpen) {
      setOpenCollapse({});
    }
  }, [sidebarOpen]);

  const handleLogout = useCallback(() => {
    signOut();
  }, [signOut]);

  const renderHtmlCollapseItem = useCallback(
    (children: Children[], isTooltip?: boolean, isInDrawer?: boolean) => {
      const shouldDisplayFullContent = isInDrawer ? true : sidebarOpen;
      return children?.map(
        ({ name: childName, href: childHref = '#', divider, hideArrow, icon }, index) => {
          if (divider) {
            return <Divider key={index} />;
          }

          const active = pathname === childHref;

          const component = (
            <ListItemButton
              key={childName}
              className={clsx({
                'child-active': active,
              })}
              onClick={(e) => {
                updateActiveIndex(undefined);
                if (childName === 'Logout') {
                  // e.preventDefault();
                  handleLogout();
                }
              }}
            >
              {(isTooltip || shouldDisplayFullContent) && (
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  width={'100%'}
                >
                  <ESPTypography
                    variant="bold_m"
                    sx={{ width: '100%', textTransform: 'capitalize' }}
                  >
                    {childName}
                    {icon}
                  </ESPTypography>
                  {!hideArrow && (
                    <KeyboardArrowRightIcon
                      className={clsx({
                        'hide-sidebar-icon': active,
                      })}
                      fontSize="small"
                    />
                  )}
                </Box>
              )}
            </ListItemButton>
          );

          return (
            <Link href={childHref} key={childName}>
              {component}
            </Link>
          );
        }
      );
    },
    [sidebarOpen, pathname, handleLogout]
  );

  const activeIndex = useRef<number | undefined>();

  const updateActiveIndex = (index: number | undefined) => {
    activeIndex.current = index;
  };

  const childDrawer = (isInDrawer?: boolean) => {
    const shouldDisplayFullContent = isInDrawer ? true : sidebarOpen;
    return (
      <>
        <Avatar sidebarOpen={shouldDisplayFullContent} />

        <List className="sidebar--content scrollbar-trigger-overflow scrollbar-trigger-overflow__hidden-x">
          {MENUS.filter((item) => item.name !== 'Setting').map(
            ({ href, icon, name, children }, index) => {
              let active = href === pathname;

              if (children?.length && children?.some((item) => item.href === pathname)) {
                active = true;
              }

              if (active) {
                updateActiveIndex(index);
              }

              const component = (
                <>
                  <ESPTooltip
                    placement="right"
                    title={
                      !shouldDisplayFullContent &&
                      children?.length &&
                      renderHtmlCollapseItem(children, true, isInDrawer)
                    }
                    slotProps={{
                      tooltip: {
                        className: 'sidebar-tooltip',
                      },
                    }}
                  >
                    <ListItemButton
                      className={clsx({
                        'active-sidebar-item__open-collapse': openCollapse[name],
                        'active-sidebar-item__open-collapse__active': openCollapse[name] && active,
                        'active-sidebar-item': active,
                      })}
                      onClick={() => {
                        if (children?.length && shouldDisplayFullContent) {
                          if (openCollapse[name]) {
                            return setOpenCollapse({});
                          }

                          return setOpenCollapse({
                            [name]: index,
                          });
                        }
                      }}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>

                      <Box
                        display={shouldDisplayFullContent ? 'flex' : 'none'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        width={'100%'}
                      >
                        <ESPTypography variant="bold_m" sx={{ textTransform: 'capitalize' }}>
                          {name}
                        </ESPTypography>

                        {index === 0 && <KeyboardArrowRightIcon fontSize="small" />}

                        {children?.length &&
                          (openCollapse[name] ? (
                            <KeyboardArrowUpIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowDownIcon fontSize="small" />
                          ))}
                      </Box>
                    </ListItemButton>
                  </ESPTooltip>

                  {children?.length && shouldDisplayFullContent && (
                    <CollapseComponent in={!!openCollapse[name]} timeout="auto" unmountOnExit>
                      {renderHtmlCollapseItem(children, false, isInDrawer)}
                      <div
                        className={clsx('overlay-collapse', {
                          'overlay-collapse__openCollapse': openCollapse[name],
                        })}
                      />
                    </CollapseComponent>
                  )}
                </>
              );

              const showOverlayAfter =
                Number(openCollapse[name]) - Number(activeIndex.current) === 1;
              const showOverlayAfterReverse =
                Number(openCollapse[name]) - Number(activeIndex.current) === -1;

              return (
                <React.Fragment key={name}>
                  <ListItem
                    sx={{ display: 'block' }}
                    onClick={() => {
                      if (!children?.length) {
                        updateActiveIndex(index);
                      }
                    }}
                  >
                    {href ? <Link href={href}>{component}</Link> : component}

                    <div
                      className={clsx('overlay-item', {
                        'overlay-item__active': active,
                        'overlay-item__openCollapse': openCollapse[name],
                      })}
                    />

                    {shouldDisplayFullContent && (
                      <>
                        <div
                          className={clsx({
                            'overlay-before': showOverlayAfter,
                            'overlay-before overlay-before__reverse': showOverlayAfterReverse,
                          })}
                        />
                        <div
                          className={clsx({
                            'overlay-after': showOverlayAfter,
                            'overlay-after overlay-after__reverse': showOverlayAfterReverse,
                          })}
                        />
                      </>
                    )}
                  </ListItem>
                </React.Fragment>
              );
            }
          )}
        </List>

        <Divider />

        <List className="sidebar--setting">
          {MENUS.filter((item) => item.name === 'Setting').map(
            ({ href, icon, name, children }, index) => {
              let active = href === pathname;

              if (children?.length && children?.some((item) => item.href === pathname)) {
                active = true;
              }

              const component = (
                <>
                  <ESPTooltip
                    placement="right"
                    title={
                      !shouldDisplayFullContent &&
                      children?.length &&
                      renderHtmlCollapseItem(children, true, isInDrawer)
                    }
                    slotProps={{
                      tooltip: {
                        className: 'sidebar-tooltip',
                      },
                    }}
                  >
                    <ListItemButton
                      className={clsx({
                        'active-sidebar-item': active,
                        'active-sidebar-item__open-collapse': openCollapse[name],
                      })}
                      onClick={() => {
                        if (children?.length && shouldDisplayFullContent) {
                          if (openCollapse[name]) {
                            return setOpenCollapse({});
                          }

                          return setOpenCollapse({
                            [name]: true,
                          });
                        }
                      }}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>

                      <Box
                        display={shouldDisplayFullContent ? 'flex' : 'none'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        width={'100%'}
                      >
                        <ESPTypography variant="bold_m">{name}</ESPTypography>
                        {children?.length &&
                          (openCollapse[name] ? (
                            <KeyboardArrowUpIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowDownIcon fontSize="small" />
                          ))}
                      </Box>
                    </ListItemButton>
                  </ESPTooltip>

                  {children?.length && shouldDisplayFullContent && (
                    <CollapseComponent in={!!openCollapse[name]} timeout="auto" unmountOnExit>
                      {renderHtmlCollapseItem(children, false, isInDrawer)}
                      <div
                        className={clsx('overlay-collapse', {
                          'overlay-collapse__openCollapse': openCollapse[name],
                        })}
                      />
                    </CollapseComponent>
                  )}
                </>
              );

              return (
                <React.Fragment key={name}>
                  <ListItem sx={{ display: 'block' }}>
                    {href ? <Link href={href}>{component}</Link> : component}

                    <div
                      className={clsx('overlay-item', {
                        'overlay-item__active': active,
                        'overlay-item__openCollapse': openCollapse[name],
                      })}
                    />
                  </ListItem>
                </React.Fragment>
              );
            }
          )}
        </List>
      </>
    );
  };

  return (
    <>
      <DrawerMediumScreen
        anchor="left"
        open={sidebarMobileOpen}
        sx={{
          '.MuiPaper-root': {
            width: sidebarOpenWidth,
          },
        }}
        onClose={toggleSidebarMobile}
      >
        {childDrawer(true)}
      </DrawerMediumScreen>

      <DrawerComponent
        variant="permanent"
        open={sidebarOpen}
        sidebarWidth={sidebarWidth}
        sidebarOpenWidth={sidebarOpenWidth}
      >
        {childDrawer()}
      </DrawerComponent>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
