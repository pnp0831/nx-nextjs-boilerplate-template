import { TabsProps } from '@mui/material';

export interface TabsArrayProps {
  index?: number;
  value?: number;
  label?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export interface ESPTabProps extends Omit<TabsProps, 'index'> {
  tabs: TabsArrayProps[];
  defaultTab?: number;
  onChangeTab?: (value: number) => void;
  className?: string;
}
