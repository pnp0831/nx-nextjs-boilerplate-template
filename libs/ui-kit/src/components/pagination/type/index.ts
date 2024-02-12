import { PaginationProps } from '@mui/material/Pagination';

import { Size } from '../../../theme';

export interface ESPPaginationProps extends PaginationProps {
  showPrevLabel?: boolean;
  showNextLabel?: boolean;
  size?: Size;
  onPageChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
  currentPage?: number;
}
