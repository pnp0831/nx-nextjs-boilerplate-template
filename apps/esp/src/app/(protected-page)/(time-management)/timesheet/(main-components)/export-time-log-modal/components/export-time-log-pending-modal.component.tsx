import './export-time-log-components.scss';

import { APP_ROUTE } from '@esp/constants';
import Link from '@esp/libs/next-link';
import { Box } from '@mui/material';
import { ESPButton } from '@ui-kit/components/button';
import { ESPTypography } from '@ui-kit/components/typography';
import { memo } from 'react';

import { IExportTimeLogPendingModal } from '../export-time-log-modal.type';

export const ExportTimeLogPendingModal = memo(({ onClose }: IExportTimeLogPendingModal) => {
  return (
    <Box className="esp-export-pending-modal">
      <Box className="esp-export-pending-modal_box">
        <ESPTypography variant="regular_l">
          Your request is being processed. Once your file is ready, it will be downloaded
          automatically or available in
          <Link className="esp-export-pending-modal_link" href={APP_ROUTE.EXPORT}>
            Export History
          </Link>
        </ESPTypography>
      </Box>

      <Box className="esp-export-pending-modal_action">
        <Box>
          <ESPButton
            className="esp-export-pending-modal_action_submit"
            color="secondary"
            onClick={onClose}
          >
            OK
          </ESPButton>
        </Box>
      </Box>
    </Box>
  );
});

ExportTimeLogPendingModal.displayName = 'ExportTimeLogPendingModal';
