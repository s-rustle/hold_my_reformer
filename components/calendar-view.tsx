"use client";

import { useMemo, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";
import Link from "next/link";
import { getMockSessionsForMonth, type SessionSlot } from "@/lib/mock-sessions";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function availabilityColor(slot: SessionSlot) {
  if (slot.spotsLeft === 0) return "bg-[var(--hmr-text-muted)]"; // full — muted green
  if (slot.spotsLeft <= 2) return "bg-[var(--hmr-leaf)]"; // limited
  return "bg-[var(--hmr-leaf-bright)]"; // open — bright green
}

export function CalendarView() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<SessionSlot | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;
  const sessions = useMemo(
    () => getMockSessionsForMonth(year, month),
    [year, month]
  );

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, SessionSlot[]>();
    sessions.forEach((s) => {
      const key = format(s.date, "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return map;
  }, [sessions]);

  return (
    <div className="mt-8">
      {/* Month nav */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate((d) => subMonths(d, 1))}
          className="hmr-btn-secondary px-4 py-2 text-sm"
        >
          Previous
        </button>
        <span className="hmr-display text-xl text-[var(--hmr-bg-text)]">
          {format(viewDate, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          className="hmr-btn-secondary px-4 py-2 text-sm"
        >
          Next
        </button>
      </div>

      {/* Calendar grid — greens */}
      <div className="hmr-card overflow-hidden">
        <div className="grid grid-cols-7 border-b-2 border-[var(--hmr-border)] bg-[var(--hmr-light)]">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--hmr-text)]"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const daySessions = sessionsByDay.get(key) ?? [];
            const inMonth = isSameMonth(day, viewDate);
            return (
              <div
                key={key}
                className={`min-h-[100px] border-b border-r border-[var(--hmr-card-border)] p-2 last:border-r-0 ${
                  inMonth ? "bg-[var(--hmr-card-bg)]" : "bg-[var(--hmr-light)]"
                }`}
              >
                <span
                  className={`text-sm ${
                    inMonth ? "text-[var(--hmr-text)]" : "text-[var(--hmr-text-muted)]"
                  }`}
                >
                  {format(day, "d")}
                </span>
                <div className="mt-1 flex flex-col gap-1">
                  {daySessions.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`flex items-center gap-1 rounded-[var(--hmr-radius-sm)] px-2 py-1.5 text-left text-xs font-medium text-white transition-all duration-200 hover:opacity-90 ${availabilityColor(slot)}`}
                    >
                      <span className="truncate">{slot.title}</span>
                      <span className="shrink-0">
                        {slot.spotsLeft}/{slot.spotsTotal}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-[var(--hmr-bg-text)]">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[var(--hmr-leaf-bright)]" />
          Open
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[var(--hmr-leaf)]" />
          Limited
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[var(--hmr-text-muted)]" />
          Full
        </span>
      </div>

      {/* Slot detail modal / panel */}
      {selectedSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--hmr-forest)]/60 p-4 backdrop-blur-[2px]"
          onClick={() => setSelectedSlot(null)}
        >
          <div
            className="hmr-card w-full max-w-md p-6 hmr-animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="hmr-display text-xl text-[var(--hmr-text)]">
              {selectedSlot.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--hmr-text-muted)]">
              {format(selectedSlot.date, "EEEE, MMM d 'at' h:mm a")} ·{" "}
              {selectedSlot.durationMinutes} min
            </p>
            <p className="mt-2 text-sm font-medium capitalize text-[var(--hmr-text)]">
              {selectedSlot.type} · {selectedSlot.spotsLeft} of{" "}
              {selectedSlot.spotsTotal} spots left
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--hmr-leaf)]">
              {selectedSlot.creditsRequired} credit
              {selectedSlot.creditsRequired !== 1 ? "s" : ""} to reserve
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href={`/reserve?slot=${selectedSlot.id}`}
                className="hmr-btn-primary flex-1 px-4 py-2.5 text-center text-sm"
              >
                Reserve session
              </Link>
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="hmr-btn-secondary px-4 py-2.5 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
