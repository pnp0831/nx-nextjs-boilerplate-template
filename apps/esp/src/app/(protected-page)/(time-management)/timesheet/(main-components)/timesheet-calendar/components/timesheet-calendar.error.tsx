import { PaperComponent } from '@esp/components//timesheet-calendar/components';
import Box from '@mui/material/Box';
import { ESPButton } from '@ui-kit/components/button';
import { ESPNotAvaliable } from '@ui-kit/components/not-available';
import { ESPTypography } from '@ui-kit/components/typography';
import { memo } from 'react';

const TimesheetCalendarError = memo(({ refetch }: { refetch: () => void }) => {
  return (
    <PaperComponent minWidth="25rem" error>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <ESPNotAvaliable width={180} height={120} text="This Page Isn’t Available Right Now" />

        <ESPTypography
          variant="regular_l"
          sx={{ color: (theme) => theme.palette.black_muted.main, margin: '2.5rem 0' }}
        >
          This may be because of a technical error that we’re working to get fixed. Try reloading
          this page.
        </ESPTypography>
        <ESPButton onClick={refetch} sx={{ height: '2.5rem', width: '8.25rem' }}>
          Reload Page
        </ESPButton>
      </Box>
    </PaperComponent>
  );
});

TimesheetCalendarError.displayName = 'TimesheetCalendarError';

export default TimesheetCalendarError;
