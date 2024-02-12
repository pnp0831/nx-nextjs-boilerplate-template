import { CardProps } from '@mui/material/Card';

export interface ESPCardProps extends Omit<CardProps, 'title'> {
  actions?: React.ReactNode;
  customize?: boolean;
  headerActions?: React.ReactNode;
  cardHeader?: React.ReactNode;
  title?: React.ReactNode;
}
