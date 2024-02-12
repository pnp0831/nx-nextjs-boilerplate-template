'use client';

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import { CardComponent } from './components';
import { ESPCardProps } from './type';

export function ESPCard({
  children,
  actions,
  title,
  headerActions,
  cardHeader,
  ...props
}: ESPCardProps) {
  return (
    <CardComponent {...props}>
      {cardHeader}
      {(title || headerActions) && <CardHeader title={title} action={headerActions} />}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </CardComponent>
  );
}

export default ESPCard;
