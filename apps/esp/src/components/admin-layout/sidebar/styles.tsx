import './index.scss';

import Box, { BoxProps } from '@mui/material/Box';
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import { ESPCollapse } from '@ui-kit/components/collapse';

export const openedMixin = (theme: Theme, width: string): CSSObject => ({
  width,
  overflowX: 'hidden',
  transition: theme.transitions.create(['margin', 'padding', 'width', 'height', 'transform'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

export const closedMixin = (theme: Theme, width: string): CSSObject => ({
  transition: theme.transitions.create(['margin', 'padding', 'width', 'height', 'transform'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width,
});

export const DrawerComponent = styled(MuiDrawer, {
  shouldForwardProp: (prop) =>
    prop !== 'open' && prop !== 'sidebarOpenWidth' && prop !== 'sidebarWidth',
})<
  DrawerProps & {
    sidebarOpenWidth: string;
    sidebarWidth: string;
  }
>(({ theme, open, sidebarOpenWidth, sidebarWidth }) => {
  return {
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',

    '& .MuiDrawer-paper': {
      [theme.breakpoints.down('md')]: {
        transform: `translateX(-${sidebarOpenWidth})`,
      },

      height: '100%',
      background: '#354053',
      color: 'white',
      borderRight: 'none',
      overflowX: 'hidden',

      svg: {
        color: 'white',
      },

      a: {
        color: 'white',
        textDecoration: 'none',
      },

      ...(!open ? closedMixin(theme, sidebarWidth) : openedMixin(theme, sidebarOpenWidth)),

      hr: {
        borderColor: theme.palette.white_muted.main,
      },

      ul: {
        '&.MuiList-root': {
          padding: 0,

          '&.sidebar--content': {
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: open ? '1rem 0' : '0.75rem 0',

            li: {
              margin: '0.625rem 0',
              '&:first-of-type': {
                marginTop: 0,
              },
            },
          },

          '&.sidebar--setting': {
            margin: '0.75rem 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: 0,
          },

          li: {
            padding: '0 0.75rem',
            paddingRight: 0,

            '.MuiListItemButton-root': {
              padding: '0.75rem 0.5rem',
              paddingRight: open ? 0 : '0.5rem',
              cursor: 'pointer',
              justifyContent: 'center',

              '&:hover': {
                transition: '300ms background',
                backgroundColor: 'unset',
                color: theme.palette.primary.main,
                borderTopLeftRadius: '0.625rem',

                '.MuiBox-root svg, .MuiListItemIcon-root svg': {
                  color: theme.palette.primary.main,
                },
              },

              '.MuiListItemIcon-root': {
                marginRight: open ? '0.5rem' : '0.75rem',
                minWidth: 'unset',
              },

              '.MuiBox-root': {
                paddingRight: '0.5rem',
                strong: {
                  cursor: 'pointer',
                },

                svg: {
                  color: theme.palette.white_muted.main,
                },
              },

              '&.active-sidebar-item': {
                backgroundColor: '#F2F2F2',
                borderColor: '#F2F2F2',
                borderBottomLeftRadius: '0.625rem',
                borderTopLeftRadius: '0.625rem',

                color: theme.palette.primary.main,

                svg: {
                  color: theme.palette.primary.main,
                },
                position: 'relative',

                '&:hover': {
                  backgroundColor: '#F2F2F2',
                  color: theme.palette.primary.main,
                  svg: {
                    color: theme.palette.primary.main,
                  },
                },

                '&__open-collapse': {
                  backgroundColor: '#F2F2F2',

                  color: theme.palette?.mandate?.main,

                  svg: {
                    color: theme.palette.mandate.main,
                  },

                  borderTopLeftRadius: '0.625rem',
                  borderBottomLeftRadius: 0,

                  borderColor: '#F2F2F2',

                  position: 'relative',

                  '&:hover': {
                    color: theme.palette.primary.main,
                    svg: {
                      color: theme.palette.primary.main,
                    },
                  },

                  ' &__active': {
                    color: theme.palette.primary.main,
                    svg: {
                      color: theme.palette.primary.main,
                    },
                  },
                },

                '&__open-collapse__active_collapse': {
                  color: theme.palette.primary.main,
                  svg: {
                    color: theme.palette.primary.main,
                  },

                  '&:hover': {
                    backgroundColor: '#F2F2F2',
                    color: theme.palette.primary.main,
                    svg: {
                      color: theme.palette.primary.main,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
});

export const DrawerMediumScreen = styled(MuiDrawer)(({ theme }) => {
  return {
    transition: theme.transitions.create(['display'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    [theme.breakpoints.up('md')]: {
      display: 'none',
    },

    '& .MuiDrawer-paper': {
      height: '100%',
      background: '#354053',
      color: 'white',
      borderRight: 'none',
      overflowX: 'hidden',

      svg: {
        color: 'white',
      },

      a: {
        color: 'white',
        textDecoration: 'none',
      },

      hr: {
        borderColor: theme.palette.white_muted.main,
      },

      ul: {
        '&.MuiList-root': {
          padding: 0,

          '&.sidebar--content': {
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '1rem 0',

            li: {
              margin: '0.625rem 0',
              '&:first-of-type': {
                marginTop: 0,
              },
            },
          },

          '&.sidebar--setting': {
            margin: '0.75rem 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: 0,
          },

          li: {
            padding: '0 0.75rem',
            paddingRight: 0,

            '.MuiListItemButton-root': {
              padding: '0.75rem 0.5rem',
              paddingRight: 0,
              cursor: 'pointer',
              justifyContent: 'center',

              '&:hover': {
                transition: '300ms background',
                backgroundColor: 'unset',
                color: theme.palette.primary.main,
                borderTopLeftRadius: '0.625rem',

                '.MuiBox-root svg, .MuiListItemIcon-root svg': {
                  color: theme.palette.primary.main,
                },
              },

              '.MuiListItemIcon-root': {
                marginRight: '0.5rem',
                minWidth: 'unset',
              },

              '.MuiBox-root': {
                paddingRight: '0.5rem',
                strong: {
                  cursor: 'pointer',
                },

                svg: {
                  color: theme.palette.white_muted.main,
                },
              },

              '&.active-sidebar-item': {
                backgroundColor: '#F2F2F2',
                borderColor: '#F2F2F2',
                borderBottomLeftRadius: '0.625rem',
                borderTopLeftRadius: '0.625rem',

                color: theme.palette.primary.main,

                svg: {
                  color: theme.palette.primary.main,
                },
                position: 'relative',

                '&:hover': {
                  backgroundColor: '#F2F2F2',
                  color: theme.palette.primary.main,
                  svg: {
                    color: theme.palette.primary.main,
                  },
                },

                '&__open-collapse': {
                  backgroundColor: '#F2F2F2',

                  color: theme.palette.mandate.main,

                  svg: {
                    color: theme.palette.mandate.main,
                  },

                  borderTopLeftRadius: '0.625rem',
                  borderBottomLeftRadius: 0,

                  borderColor: '#F2F2F2',

                  position: 'relative',

                  '&:hover': {
                    color: theme.palette.primary.main,
                    svg: {
                      color: theme.palette.primary.main,
                    },
                  },

                  ' &__active': {
                    color: theme.palette.primary.main,
                    svg: {
                      color: theme.palette.primary.main,
                    },
                  },
                },

                '&__open-collapse__active_collapse': {
                  color: theme.palette.primary.main,
                  svg: {
                    color: theme.palette.primary.main,
                  },

                  '&:hover': {
                    backgroundColor: '#F2F2F2',
                    color: theme.palette.primary.main,
                    svg: {
                      color: theme.palette.primary.main,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
});

export const WrapperAvatar = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })<
  BoxProps & { open: boolean }
>(({ open }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  padding: open ? '1.5rem 0 0' : '0.75rem 0 0',
  '>span ': {
    marginBottom: '0.25rem',

    '>div': {
      width: open ? '5rem' : '3.375rem',
      height: open ? '5rem' : '3.375rem',
    },
  },
}));

export const CollapseComponent = styled(ESPCollapse)(({ theme, in: open }) => {
  return {
    '&.MuiCollapse-root': {
      position: 'relative',
      background: theme.palette.common.white,
      color: theme.palette.common.black,
      borderBottomLeftRadius: '0.625rem',
      borderBottomRightRadius: '0.625rem',
      borderTopRightRadius: open && '0.625rem',

      '.MuiCollapse-wrapper': {
        hr: {
          borderColor: theme.palette.gray_medium.main,
          width: 'calc(100% - 2rem)',
          margin: '0.5rem auto',
        },

        a: {
          textDecoration: 'none',

          '&:last-of-type div.MuiListItemButton-root.MuiButtonBase-root': {
            paddingBottom: '1rem',
          },

          'div.MuiListItemButton-root.MuiButtonBase-root': {
            paddingLeft: '1rem',
            paddingBottom: '0.5rem',

            cursor: 'pointer',

            color: theme.palette.mandate.main,

            svg: {
              color: theme.palette.gray_dark.main,
            },

            strong: {
              display: 'flex',
              svg: {
                color: theme.palette.mandate.main,
                width: '0.75em',
                marginLeft: '0.25rem',
              },
            },

            '&.child-active, &:hover': {
              color: theme.palette.primary.main,

              svg: {
                color: theme.palette.primary.main,
              },
            },
          },
        },
      },
    },
  };
});
