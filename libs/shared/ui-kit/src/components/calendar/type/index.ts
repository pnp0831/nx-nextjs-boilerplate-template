import { Dayjs } from 'dayjs';

// TODO: define interface Event
export interface Event {
  data: unknown;
}

export interface ESPCalendarProps {
  events: {
    [key: string]: Event;
  };
  disabledWeekend?: boolean;
  disabledPast?: boolean;
  disabledFuture?: boolean;
  onAdd?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  shouldDisabledDate?: (data: Dayjs) => boolean;
  format?: string;
  holidays?: {
    [key: string]: Event | boolean;
  };
  currentDate?: Dayjs;
  setCurrentDate?: (data: Dayjs) => void;
}
