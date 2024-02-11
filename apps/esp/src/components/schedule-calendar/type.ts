import FullCalendar from '@fullcalendar/react';
import React from 'react';

interface ExternalEvent {
  id: string | number;
  color: string;
  name: React.ReactNode;
  [key: string]: unknown;
}

export interface SchedulerCalendarProps {
  format?: string;
  externalEvents?: ExternalEvent[];
  slotDuration?: SlotDuration;
  setSlotDuration?: (slot: SlotDuration) => void;
}

export enum SlotDuration {
  '1_HOUR' = '00:60:00',
  '30_MINUTES' = '00:30:00',
  '15_MINUTES' = '00:15:00',
}

export type FullCalendarRef = FullCalendar | null;

export interface Event {
  title: string;
  code: string;
  allDay?: boolean;
  start?: string;
  end?: string;
  eventColor?: string | number;
  eventId?: string | number;
  eventDate?: string;
  color?: string;
  isClone?: boolean;
}

export const HEIGHT_OF_SLOT = {
  '1h': 3.2,
  '30m': 3.2,
  '15m': 2,
};

export const heightOfSlots: { [key in SlotDuration]: number } = {
  [SlotDuration['1_HOUR']]: HEIGHT_OF_SLOT['1h'],
  [SlotDuration['30_MINUTES']]: HEIGHT_OF_SLOT['30m'],
  [SlotDuration['15_MINUTES']]: HEIGHT_OF_SLOT['15m'],
};

//  {
//       title: 'Anchor Designer API 10',
//       code: '[ES140633]',
//       start: dayjs().toISOString(),
//       end: dayjs().add(1, 'h').toISOString(),
//       eventColor: '#FF5308',
//       eventId: '11',
//       eventDate: dayjs().format(format),
//     },
//     {
//       title: 'Anchor Designer API 11',
//       code: '[ES140633]',
//       start: dayjs().subtract(1, 'd').toISOString(),
//       end: dayjs().subtract(1, 'd').add(1, 'h').toISOString(),
//       eventColor: '#008FDD',
//       eventId: '11',
//       eventDate: dayjs().subtract(1, 'd').format(format),
//     },
