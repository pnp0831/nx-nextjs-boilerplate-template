import './index.scss';

import Box from '@mui/material/Box';

import { ESPLoadingProps } from './type';

export function ESPLoading({ loading, container, hasContainer, sx }: ESPLoadingProps) {
  if (!loading) {
    return null;
  }

  if (hasContainer) {
    if (container?.current) {
      return (
        <Box className="loading" sx={sx}>
          <div>
            <img alt="loading" src="/images/loading.gif" />
          </div>
        </Box>
      );
    }

    return null;
  }

  return (
    <Box className="loading-page" sx={sx}>
      <img alt="loading" src="/images/loading.gif" />
    </Box>
  );
}
