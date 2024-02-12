import { PopperPlacementType } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { DesktopDatePickerSlotsComponentsProps } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';

import { hexToRgb } from '../../../helpers';

export const getSlotProps = (
  theme: Theme,
  slotProps: DesktopDatePickerSlotsComponentsProps<Dayjs>,
  popoverStyle?: { [key: string]: unknown },
  popoverPosition?: PopperPlacementType
): DesktopDatePickerSlotsComponentsProps<Dayjs> => ({
  ...slotProps,
  popper: {
    placement: popoverPosition ? popoverPosition : 'bottom-end',
    disablePortal: false,
    sx: {
      color: theme.palette.common.black,
      '.MuiPaper-root': {
        background: theme.palette.common.white,
        overflow: 'visible',
        mt: 1.5,
        ...(popoverPosition === 'right-end' && {
          mt: 0,
          ml: 1.5,
        }),
        '.MuiPickersLayout-root': {
          position: 'relative',
          transition: 'none',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: '0',
            right: '2%',
            width: '1rem',
            height: '0.5rem',
            bgcolor: theme.palette.common.white,
            transform: 'rotate(45deg)',
            zIndex: 0,
            transition: 'none',
            ...((popoverPosition === 'right-end' || popoverPosition === 'left-end') && {
              display: 'none',
            }),
          },

          ...(popoverStyle && popoverStyle),
          // custom Toolbar
          '.MuiPickersCalendarHeader-root': {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            '&:first-of-type': {
              order: 0,
              paddingRight: '1.25rem',
              paddingLeft: '1.25rem',
            },
            '.MuiPickersCalendarHeader-switchViewButton': {
              display: 'none',
            },
            '.MuiPickersArrowSwitcher-root': {
              width: '100%',
              display: 'inline-flex',
              justifyContent: 'space-between',
              alignItems: 'center',

              '.MuiButtonBase-root': {
                color: theme.palette.common.black,
                '&:disabled': {
                  color: hexToRgb(theme.palette.black_muted.main, 0.4),
                },
              },
            },
            '.MuiPickersCalendarHeader-label': {
              color: theme.palette.common.black,
              textAlign: 'center',
              margin: 0,
              ...theme.typography.h4,
            },
            '.MuiPickersArrowSwitcher-spacer': {
              width: '13.75rem',
            },
            '.MuiPickersFadeTransitionGroup-root': {
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            },
          },

          // custom weekdays
          '.MuiDayCalendar-header': {
            // justifyContent: 'space-between',
            '.MuiTypography-caption MuiDayCalendar-weekDayLabel': {
              ...theme.typography.bold_s,
            },
            '.MuiDayCalendar-weekDayLabel:nth-of-type(1):after ': {
              content: '"un"',
              display: 'inline-block',
            },
            '.MuiDayCalendar-weekDayLabel:nth-of-type(2):after ': {
              content: '"on"',
              display: 'inline-block',
            },
            '.MuiDayCalendar-weekDayLabel:nth-of-type(3):after ': {
              content: '"ue"',
              display: 'inline-block',
            },
            '.MuiDayCalendar-weekDayLabel:nth-of-type(4):after ': {
              content: '"ed"',
              display: 'inline-block',
            },
            '.MuiDayCalendar-weekDayLabel:nth-of-type(5):after ': {
              content: '"hu"',
              display: 'inline-block',
            },
            '.MuiDayCalendar-weekDayLabel:nth-of-type(6):after ': {
              content: '"ri"',
              display: 'inline-block',
            },
            '.MuiDayCalendar-weekDayLabel:nth-of-type(7):after ': {
              content: '"at"',
              display: 'inline-block',
            },

            span: {
              color: hexToRgb(theme.palette.black_muted.main, 0.4),
              ...theme.typography.bold_s,
            },
          },

          // custom render day
          '.MuiPickersDay-root': {
            // margin: 0,
            color: theme.palette.common.black,
            ...theme.typography.regular_m,

            '&:hover, &[aria-selected="true"], &:focus, &.Mui-selected': {
              backgroundColor: hexToRgb(theme.palette.primary.main, 0.8),
              ...theme.typography.bold_m,
            },

            '&.Mui-disabled, &.Mui-disabled:not(.Mui-selected)': {
              color: hexToRgb(theme.palette.black_muted.main, 0.4),
            },

            '&.MuiPickersDay-today': {
              borderColor: theme.palette.primary.main,
              ...theme.typography.bold_m,
            },

            '&.MuiPickersDay-dayOutsideMonth,&.MuiPickersDay-dayOutsideMonth:hover': {
              color: hexToRgb(theme.palette.black_muted.main, 0.4),
            },
          },

          // custom year picker
          '.MuiYearCalendar-root': {
            '.MuiPickersYear-root button': {
              '&:not(:disabled)': {
                color: theme.palette.common.black,
                ...theme.typography.regular_m,

                '&:hover': {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
              },
              '&:disabled': {
                color: hexToRgb(theme.palette.black_muted.main, 0.4),
                ...theme.typography.regular_m,
              },

              '&.Mui-selected': {
                backgroundColor: hexToRgb(theme.palette.primary.main, 0.8),
                ...theme.typography.bold_m,
              },
            },
          },

          // custom month picker
          '.MuiMonthCalendar-root': {
            '.MuiPickersMonth-root button': {
              '&:not(:disabled)': {
                color: theme.palette.common.black,
                ...theme.typography.regular_m,

                '&:hover': {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
              },

              '&.Mui-selected': {
                backgroundColor: hexToRgb(theme.palette.primary.main, 0.8),
                ...theme.typography.bold_m,
              },

              '&:disabled': {
                color: hexToRgb(theme.palette.black_muted.main, 0.4),
                ...theme.typography.regular_m,
              },
            },
          },

          '@media (min-width: 1200px) and (max-width: 1536px) and (min-height: 300px) and (max-height: 680px)':
            {
              '.MuiDateCalendar-root': {
                width: '22rem',
              },

              '.MuiPickersCalendarHeader-root': {
                maxHeight: '1.25rem',
                marginTop: '0.5rem',
                '&:first-of-type': {
                  order: 0,
                  paddingRight: '0.75rem',
                  paddingLeft: '0.75rem',
                },
              },
            },
        },
      },
    },
  },
});
