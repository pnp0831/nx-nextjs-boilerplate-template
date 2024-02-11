'use client';

import './index.scss';

import { useAppContext } from '@esp/contexts/app-context';
import { inElement } from '@esp/utils/helper';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { ESPButton } from '@ui-kit/components/button';
import { ESPButtonColors } from '@ui-kit/components/button/type';
import { ESPPopover } from '@ui-kit/components/popover';
import { ESPTypography } from '@ui-kit/components/typography';
import { useNotify } from '@ui-kit/contexts/notify-context';
import { hexToRgb } from '@ui-kit/helpers';
import clsx from 'clsx';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import DateHover from './date-hover';
import { Event, FullCalendarRef, SchedulerCalendarProps, SlotDuration } from './type';

const SAT_AND_SUN = [0, 6];

const SchedulerCalendar = ({
  format = 'DD/MM/YYYY',
  externalEvents = [],
  slotDuration: slotDurationProp,
  setSlotDuration: setSlotDuationProp,
}: SchedulerCalendarProps) => {
  const theme = useTheme();

  const fullCalendarRef = useRef<FullCalendarRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { notifySuccess } = useNotify();
  const { sidebarOpen } = useAppContext();

  // @ts-expect-error: TODO
  const calendarRef = fullCalendarRef.current?.calendar;

  const [slotDuration, setSlotDuration] = useState<SlotDuration>(
    slotDurationProp || SlotDuration['1_HOUR']
  );

  useEffect(() => {
    if (setSlotDuationProp) {
      setSlotDuationProp(slotDuration);
    }
  }, [slotDuration, setSlotDuationProp]);

  const [currentDate, setCurrentDate] = useState<string>(dayjs().format('MMMM YYYY'));

  const [dragging, setDragging] = useState<boolean>(false);

  const externalEventsRef = useRef<(HTMLElement | null)[]>([]);

  const [events, setEvents] = useState<Event[]>([]);

  const handleAddEventDraggable = (id = 'external-events-popover') => {
    setTimeout(() => {
      const containerEl = document.getElementById(id) as HTMLElement;

      if (containerEl) {
        new Draggable(containerEl, {
          itemSelector: '.fc-event',
          eventData: function (eventEl) {
            let extendedProps = {};
            if (eventEl.dataset.event) {
              extendedProps = JSON.parse(eventEl.dataset.event);
            }
            return {
              title: eventEl.innerText,
              ...extendedProps,
              stick: true,
            };
          },
        });
      }
    }, 100);
  };

  useEffect(() => {
    handleAddEventDraggable('external-events');
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (calendarRef) {
        calendarRef.today();
      }
    }, 175);
  }, [sidebarOpen, calendarRef]);

  useEffect(() => {
    externalEventsRef.current.forEach((ref: HTMLElement | null) => {
      if (ref) {
        ref.addEventListener('mousedown', () => setDragging(true));
        ref.addEventListener('mouseup', () => setDragging(false));
      }
    });

    return () => {
      if (externalEventsRef.current) {
        externalEventsRef.current.forEach((ref: HTMLElement | null) => {
          if (ref) {
            ref.removeEventListener('mousedown', () => setDragging(true));
            ref.removeEventListener('mouseup', () => setDragging(false));
          }
        });
      }
    };
  }, [externalEvents]);

  const renderExternalEvent = useCallback(() => {
    return externalEvents.map((item, index) => (
      <div
        className="fc-event fc-external-event"
        key={index}
        style={{
          backgroundColor: item.color,
          padding: '0.25rem 0.5rem',
          width: 'max-content',
          cursor: 'move',
          borderRadius: '0.25rem',
          marginBottom: '0.5rem',
        }}
        ref={(el) => (externalEventsRef.current[index] = el)}
        data-event={JSON.stringify({
          title: `Anchor Designer API external ${index}`,
          code: '[ES140633]',
          eventId: `${index + 1}`,
          eventColor: item.color,
        })}
      >
        <ESPTypography variant="bold_s">{item.name}</ESPTypography>
      </div>
    ));
  }, [externalEvents]);

  const renderDayHeaderContent = (date: Date) => {
    const newDate = dayjs(date);
    const dateInmonth = newDate.date();
    const dayOfWeek = newDate.day();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = newDate.format('DD/MM/YYYY') === dayjs().format('DD/MM/YYYY');

    const isSatOrSun = SAT_AND_SUN.includes(dayOfWeek);

    return (
      <div
        className={clsx('fc-day-header-content', {
          today,
          satAndSun: isSatOrSun,
        })}
      >
        {!isSatOrSun && (
          <div className="fc-day-header-content__icon">
            {dateInmonth % 5 === 0 ? (
              <CheckCircleOutlinedIcon color="success" fontSize="small" />
            ) : (
              <InfoOutlinedIcon color="warning" fontSize="small" />
            )}
          </div>
        )}

        {!isSatOrSun && (
          <div className="fc-day-header-content__badge">
            <ESPPopover
              onOpenChange={(open) => {
                if (open) {
                  handleAddEventDraggable();
                }
              }}
              contentStyle={{
                textAlign: 'left',
              }}
              PopperProps={{
                disablePortal: false,
              }}
              placement="bottom"
              popoverContent={
                <div
                  className="external-events"
                  id="external-events-popover"
                  style={{ padding: '0.25rem 0' }}
                >
                  {renderExternalEvent()}
                </div>
              }
            >
              <ESPTypography variant="regular_s">{dateInmonth}</ESPTypography>
            </ESPPopover>
          </div>
        )}

        <ESPTypography variant="regular_s" marginBottom="0.125rem">
          {weekdays[dayOfWeek]}
        </ESPTypography>
        <ESPTypography variant="bold_xl">{dateInmonth}</ESPTypography>
      </div>
    );
  };

  const renderDayCellContent = (date: Date) => {
    if (SAT_AND_SUN.includes(dayjs(date).day())) {
      return null;
    }

    return <DateHover slotDuration={slotDuration} dragging={dragging} />;
  };

  return (
    <div className="scheduler-calendar">
      <div className="external-events" id="external-events" style={{ padding: '1rem' }}>
        {renderExternalEvent()}
      </div>

      <div className="calendar-container">
        <div className="calendar-container__header">
          <ESPTypography variant="bold_xl">{currentDate}</ESPTypography>

          <div className="calendar-container__toolbar">
            {Object.values(SlotDuration).map((duration) => {
              let color = 'secondary';

              const slot = duration.split(':')[1];

              if (duration === slotDuration) {
                color = 'primary';
              }

              return (
                <ESPButton
                  color={color as ESPButtonColors}
                  sx={{
                    background:
                      color === 'secondary'
                        ? theme.palette.gray_medium.main
                        : theme.palette.primary.main,
                    minWidth: '2.625rem',
                  }}
                  onClick={() => setSlotDuration(duration as SlotDuration)}
                  key={duration}
                >
                  {slot}
                </ESPButton>
              );
            })}

            <ESPButton
              onClick={() => {
                if (calendarRef) {
                  calendarRef.today();

                  const date = dayjs(calendarRef.currentData?.currentDate).format('MMMM YYYY');

                  if (currentDate !== date) {
                    setCurrentDate(date);
                  }
                }
              }}
            >
              Today
            </ESPButton>

            <div className="calendar-container__toolbar__button-group">
              <div>
                <KeyboardArrowLeftIcon
                  fontSize="small"
                  onClick={() => {
                    if (calendarRef) {
                      calendarRef.prev();

                      const date = dayjs(calendarRef.currentData?.currentDate).format('MMMM YYYY');

                      if (currentDate !== date) {
                        setCurrentDate(date);
                      }
                    }
                  }}
                />
              </div>
              <div>
                <KeyboardArrowRightIcon
                  fontSize="small"
                  onClick={() => {
                    if (calendarRef) {
                      calendarRef.next();

                      const date = dayjs(calendarRef.currentData?.currentDate).format('MMMM YYYY');

                      if (currentDate !== date) {
                        setCurrentDate(date);
                      }
                    }
                  }}
                />
              </div>
            </div>
            <SettingsIcon />
          </div>
        </div>

        <div
          className={clsx('full-calendar', {
            slot1h: slotDuration === SlotDuration['1_HOUR'],
            slot30m: slotDuration === SlotDuration['30_MINUTES'],
            slot15m: slotDuration === SlotDuration['15_MINUTES'],
          })}
          ref={containerRef}
        >
          <FullCalendar
            // handle event click ( open modal )
            eventClick={(info) => {}}
            timeZone="UTC"
            firstDay={1}
            slotMinWidth={100}
            height={550}
            ref={fullCalendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={events}
            headerToolbar={false}
            views={{
              timeGridWeek: { slotDuration },
            }}
            allDaySlot={false}
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: true,
            }}
            dayCellContent={({ date }) => renderDayCellContent(date)}
            editable
            droppable
            // Custmom day header
            dayHeaderContent={({ date }) => renderDayHeaderContent(date)}
            // hiddenDays={[6, 0]}
            // Disallow dropping on Saturdays and Sundays
            eventAllow={(dropInfo) => !SAT_AND_SUN.includes(dayjs(dropInfo.start).day())}
            eventDragStart={() => setDragging(true)}
            // handle event receive ( drag event external )
            eventReceive={(info) => {
              // info.revert();
              setDragging(false);

              const { event } = info;

              // const originalEvent = {
              //   title: event.title,
              //   start: dayjs(event._instance?.range.start).toISOString(),
              //   end: dayjs(event._instance?.range.end).toISOString(),
              //   allDay: event.allDay,
              //   eventDate: dayjs(event.start).format(format),
              //   color: event.backgroundColor,
              //   ...event._def.extendedProps,
              // };

              // const eventDuplicate = events.find(
              //   (e) =>
              //     e.eventDate === dayjs(event.start).format(format) &&
              //     e.eventId === event._def.extendedProps.eventId
              // );
              // if (eventDuplicate) {
              //   return notifySuccess(`Duplicate event "${originalEvent.title}"`, {
              //     variant: 'error',
              //   });
              // }

              // const newEvents = [originalEvent];

              // if (!event.allDay) {
              //   const allDayEvent = {
              //     color: event.backgroundColor,
              //     title: event.title,
              //     start: dayjs(event.start).toISOString(),
              //     end: dayjs(event.start).add(1, 'd').toISOString(),
              //     allDay: true,
              //     eventDate: dayjs(event.start).format(format),
              //     ...event._def.extendedProps,
              //     isClone: true,
              //   };
              //   newEvents.push(allDayEvent);
              // }

              notifySuccess(`Add event "${event.title}" successfully`, {
                variant: 'success',
              });

              // setEvents([...events, ...newEvents]);
            }}
            // remove item outside
            dragRevertDuration={200}
            eventDragStop={({ jsEvent, event }) => {
              setDragging(false);
              if (!containerRef.current) {
                return;
              }

              if (inElement({ x: jsEvent.pageX, y: jsEvent.pageY }, containerRef.current)) {
                return;
              }

              return event.remove();
            }}
            // handle remove event
            eventRemove={(info) => {
              //TODO: find way to handle better / or call api
              const eventsAfterRemove = events.filter(
                (e) => e.eventId !== info.event._def.extendedProps.eventId
              );
              setEvents(eventsAfterRemove);
              return notifySuccess(`Remove event "${info.event.title}" successfully`, {
                variant: 'success',
              });
            }}
            // handle logic when drag item into calendar
            dayMaxEventRows={3}
            // handle move event
            eventDrop={(info) => {
              // info.revert();
              // const newEvents = [...events];
              // const { event } = info;
              // Prevent move event have scheduler to allday.
              // Prevent move event from allday to scheduler on samedate.
              // if ((!oldEvent.allDay && event.allDay) || (oldEvent.allDay && !event.allDay)) {
              //   info.revert();
              //   return notifySuccess(`Cant move event ${event.title}`, { variant: 'error' });
              // }
              // Handle move event all day to have scheduler to another day
              // if (event.allDay && oldEvent.allDay) {
              //   newEvents = newEvents.map((e) => {
              //     if (e.eventId === event._def.extendedProps.eventId) {
              //       let newStartDate = e.start;
              //       let newEndDate = e.end;
              //       if (!e.allDay) {
              //         newStartDate = dayjs(e.start).add(delta.days, 'd').toISOString();
              //         newEndDate = dayjs(e.end).add(delta.days, 'd').toISOString();
              //       }
              //       return {
              //         ...e,
              //         start: e.allDay ? event.startStr : newStartDate,
              //         end: e.allDay ? event.endStr : newEndDate,
              //         allDay: e.allDay,
              //         eventDate: dayjs(event.start).format(format),
              //       };
              //     }
              //     return e;
              //   });
              //   setEvents(newEvents);
              //   return notifySuccess(`Move event ${event.title} successfully`);
              // }
              // // Handle move event have scheduler to another day
              // if (delta.days || delta.years || delta.months || delta.milliseconds) {
              //   newEvents = newEvents.map((e) => {
              //     if (e.eventId === event._def.extendedProps.eventId) {
              //       return {
              //         ...e,
              //         start: event.startStr,
              //         end: event.endStr,
              //         allDay: e.allDay,
              //         eventDate: dayjs(event.start).format(format),
              //       };
              //     }
              //     return e;
              //   });
              //   setEvents(newEvents);
              //   return notifySuccess(`Move event ${event.title} successfully`);
              // }
              // return notifySuccess(`Move event ${event.title} successfully`, { variant: 'success' });
            }}
            // // handle event content
            eventContent={(info) => {
              const { event } = info;

              // if (event.allDay) {
              //   return (
              //     <>
              //       <Box display={'flex'} alignItems={'center'}>
              //         <AccessTimeIcon fontSize="small" />
              //         <ESPTypography variant="bold_s">
              //           {event._def?.extendedProps?.code}
              //         </ESPTypography>
              //       </Box>

              //       <ESPTypography variant="regular_s">{event.title}</ESPTypography>
              //     </>
              //   );
              // }

              return (
                <>
                  <div
                    className="eventBackground"
                    style={{
                      background:
                        event._def.extendedProps.eventColor &&
                        hexToRgb(event._def.extendedProps.eventColor, 0.3),
                    }}
                  />
                  <div
                    className="eventDivider"
                    style={{ background: event._def.extendedProps.eventColor }}
                  />
                  <ESPTypography
                    component="span"
                    variant="bold_s"
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {event._def?.extendedProps?.code}
                  </ESPTypography>
                  <ESPTypography
                    component="span"
                    variant="regular_s"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1rem',
                      WebkitLineClamp: 2,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {event.title}
                  </ESPTypography>
                </>
              );
            }}
            eventColor={'#fff'}
            eventTextColor={'#333333'}
            dateClick={(info) => {
              // window.alert(info.dateStr);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedulerCalendar;
