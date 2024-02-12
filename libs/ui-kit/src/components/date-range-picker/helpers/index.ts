import { Theme } from '@mui/material/styles';

import { hexToRgb } from '../../../helpers';

export const popoverStyle = (theme: Theme) => ({
  // For date range picker
  '.MuiDayCalendar-monthContainer': {
    '.MuiDayCalendar-weekContainer': {
      '.MuiDayCalendar-highlightDay': {
        position: 'relative',

        '&.MuiDayCalendar-highlightDay-firstDay.MuiDayCalendar-highlightDay-lastDay': {
          button: {
            borderRadius: '50%',
          },

          '&:after': {
            display: 'none',
          },
        },

        '&.MuiDayCalendar-highlightDay-firstDay': {
          button: {
            backgroundColor: hexToRgb(theme.palette.primary.main, 0.8),
            ...theme.typography.bold_m,
          },
          '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            backgroundColor: hexToRgb(theme.palette.primary.main, 0.1),
            zIndex: 0,
          },
        },

        '&.MuiDayCalendar-highlightDay-lastDay': {
          button: {
            backgroundColor: hexToRgb(theme.palette.primary.main, 0.8),
            ...theme.typography.bold_m,
          },

          '&:first-of-type': {
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              backgroundColor: hexToRgb(theme.palette.primary.main, 0.1),
              zIndex: 0,
            },
          },

          '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            width: '50%',
            height: '100%',
            backgroundColor: hexToRgb(theme.palette.primary.main, 0.1),
            zIndex: 0,
          },
        },

        '&.MuiDayCalendar-highlightDay-betweenDay': {
          backgroundColor: hexToRgb(theme.palette.primary.main, 0.1),
          '&:first-of-type': {
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              backgroundColor: hexToRgb(theme.palette.primary.main, 0.1),
              zIndex: 0,
            },
          },
        },

        '&.MuiDayCalendar-highlightDay-betweenDay button': {
          borderRadius: 0,
          ...theme.typography.bold_m,

          '&:hover': {
            borderRadius: '50%',
            backgroundColor: hexToRgb(theme.palette.primary.main, 0.8),
          },

          '&.MuiPickersDay-today': {
            border: 'none',
          },
        },

        '> button ': {
          color: theme.palette.common.black,
          zIndex: 1,
        },

        // first row
        '&:first-of-type': {
          '&.MuiDayCalendar-highlightDay-firstDay': {
            '&:before': {
              borderTopLeftRadius: '50%',
              borderBottomLeftRadius: '50%',
            },
          },
        },

        // last row
        '&:last-of-type': {
          color: 'red',

          '&.MuiDayCalendar-highlightDay-lastDay': {
            '&:before': {
              color: 'red',
              borderTopRightRadius: '0',
              borderBottomRightRadius: '0',
              backgroundColor: 'transparent',
            },
          },

          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: '-100%',
            width: '100%',
            height: '100%',
            backgroundColor: hexToRgb(theme.palette.primary.main, 0.1),
            zIndex: 0,
          },
        },
      },

      '.MuiDayCalendar-highlightDay__dashed': {
        position: 'relative',

        '&.MuiDayCalendar-highlightDay-firstDay__dashed': {
          button: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        },

        '&.MuiDayCalendar-highlightDay-lastDay__dashed': {
          button: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor: hexToRgb(theme.palette.primary.main, 0.8),
          },

          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: '0',
            width: '50%',
            height: '100%',
            backgroundColor: 'transparent',
            borderTop: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            borderBottom: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            zIndex: 0,
          },
        },

        '&.MuiDayCalendar-highlightDay-betweenDay__dashed button': {
          border: 'none',
          ...theme.typography.bold_m,

          '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: '150%',
            height: '100%',
            borderTop: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            borderBottom: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            zIndex: 0,
          },
        },

        // first row
        '&:first-of-type ': {
          '&.MuiDayCalendar-highlightDay-lastDay__dashed:before': {
            left: '-50%',
            width: '100%',
          },

          '&.MuiDayCalendar-highlightDay-betweenDay__dashed:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: '-1.125rem',
            width: '100%',
            height: '100%',
            borderTop: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            borderBottom: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            zIndex: 0,
          },
        },

        // last row
        '&:last-of-type ': {
          '&.MuiDayCalendar-highlightDay-lastDay__dashed:before': {
            width: '100%',
            border: 'none',
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '50%',
          },

          '&.MuiDayCalendar-highlightDay-firstDay__dashed:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '150%',
            height: '100%',
            borderTop: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            borderBottom: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            zIndex: 0,
          },

          '&.MuiDayCalendar-highlightDay-betweenDay__dashed:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: '-1.4375rem',
            width: '60%',
            height: '100%',
            borderTop: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            borderBottom: `1px dashed ${hexToRgb(theme.palette.primary.main, 0.8)}`,
            zIndex: 0,
          },
        },
      },
    },
  },
});
