"use client";

import { useCallback, useMemo } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek as dfStartOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => dfStartOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "BLOCK" | "CLASS";
  maxParticipants: number;
  creditsRequired: number;
  bookingCount?: number;
  isBooked?: boolean;
  resource?: unknown;
};

type Props = {
  events: CalendarEvent[];
  onSelectSlot?: (start: Date, end: Date) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  onRangeChange?: (range: Date[] | { start: Date; end: Date }) => void;
  readOnly?: boolean;
};

export function Calendar({
  events,
  onSelectSlot,
  onSelectEvent,
  onRangeChange,
  readOnly = false,
}: Props) {
  const { defaultDate, messages } = useMemo(
    () => ({
      defaultDate: new Date(),
      messages: {
        today: "Today",
        previous: "Back",
        next: "Next",
        month: "Month",
        week: "Week",
        day: "Day",
        agenda: "Agenda",
        date: "Date",
        time: "Time",
        event: "Event",
        noEventsInRange: "No sessions in this range.",
        showMore: (total: number) => `+${total} more`,
      },
    }),
    []
  );

  const eventStyleGetter = useCallback(
    (event: CalendarEvent) => {
      const isClass = event.type === "CLASS";
      const full =
        event.bookingCount !== undefined &&
        event.maxParticipants > 0 &&
        event.bookingCount >= event.maxParticipants;
      return {
        style: {
          backgroundColor: event.isBooked
            ? "#059669"
            : isClass
              ? full
                ? "#dc2626"
                : "#2563eb"
              : "#64748b",
          borderRadius: "4px",
        },
      };
    },
    []
  );

  return (
    <div className="h-[600px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        defaultDate={defaultDate}
        defaultView="week"
        views={["month", "week", "day", "agenda"]}
        selectable={!readOnly && !!onSelectSlot}
        onSelectSlot={
          onSelectSlot
            ? ({ start, end }) => onSelectSlot(start, end)
            : undefined
        }
        onSelectEvent={onSelectEvent}
        onRangeChange={onRangeChange}
        eventPropGetter={eventStyleGetter}
        messages={messages}
        className="rbc-calendar"
      />
    </div>
  );
}
