import { SxProps } from '@mui/material';
import { ReactNode } from 'react';

export type ListContentData = {
  label: string;
  onClick?: () => void;
};

export interface ESPMenuProps {
  buttonLabel?: string;
  startIcon?: ReactNode;
  listContent: ListContentData[];
  styleButton?: SxProps;
  colorButton?: 'primary' | 'secondary';
}
