"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Calendar, type CalendarEvent } from "@/components/calendar";
import { startOfMonth, endOfMonth, format } from "date-fns";

type ApiEvent = {
  id: string;
  title: string;
  type: string;
  start: string;
  end: string;
  maxParticipants: number;
  creditsRequired: number;
  bookings: { userId: string }[];
};

export function MemberDashboard({
  userId,
  initialCredits,
}: {
  userId: string;
  initialCredits: number;
}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [bookings, setBookings] = useState<{ id: string; event: ApiEvent }[]>([]);
  const [credits, setCredits] = useState(initialCredits);
  const [range, setRange] = useState<{ start: Date; end: Date }>(() => {
    const now = new Date();
    return { start: startOfMonth(now), end: endOfMonth(now) };
  });
  const [loading, setLoading] = useState(true);
  const [bookingEvent, setBookingEvent] = useState<CalendarEvent | null>(null);
  const [error, setError] = useState("");

  const fetchEvents = useCallback(async (start: Date, end: Date) => {
    const res = await fetch(
      `/api/events?start=${start.toISOString()}&end=${end.toISOString()}`
    );
    if (!res.ok) return [];
    const data: ApiEvent[] = await res.json();
    return data.map((e) => ({
      id: e.id,
      title: e.title,
      start: new Date(e.start),
      end: new Date(e.end),
      type: e.type as "BLOCK" | "CLASS",
      maxParticipants: e.maxParticipants,
      creditsRequired: e.creditsRequired,
      bookingCount: e.bookings.length,
      isBooked: e.bookings.some((b) => b.userId === userId),
    }));
  }, [userId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [evts, bookRes, credRes] = await Promise.all([
        fetchEvents(range.start, range.end),
        fetch("/api/bookings").then((r) => r.ok ? r.json() : []),
        fetch("/api/credits").then((r) => r.ok ? r.json() : { credits: 0 }),
      ]);
      setEvents(evts);
      setBookings(bookRes);
      setCredits(credRes.credits ?? 0);
    } finally {
      setLoading(false);
    }
  }, [range, fetchEvents]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRangeChange = useCallback(
    (range: Date[] | { start: Date; end: Date }) => {
      const start = Array.isArray(range) ? range[0] : range.start;
      const end = Array.isArray(range) ? range[range.length - 1] : range.end;
      setRange({ start, end });
    },
    []
  );

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    if (event.isBooked) return;
    setBookingEvent(event);
    setError("");
  }, []);

  const handleConfirmBook = useCallback(async () => {
    if (!bookingEvent) return;
    setError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: bookingEvent.id }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to book");
      return;
    }
    setBookingEvent(null);
    load();
  }, [bookingEvent, load]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Hold My Reformer
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-0.5">
            Member dashboard
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-zinc-200 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {credits} credits
          </span>
          <Link
            href="/"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm"
          >
            Home
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm"
          >
            Sign out
          </button>
        </div>
      </header>

      {bookingEvent && (
        <div className="mb-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Book: {bookingEvent.title}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {format(bookingEvent.start, "PPp")} · {bookingEvent.creditsRequired}{" "}
              credit{bookingEvent.creditsRequired !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <button
              onClick={handleConfirmBook}
              disabled={credits < bookingEvent.creditsRequired}
              className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Confirm booking
            </button>
            <button
              onClick={() => { setBookingEvent(null); setError(""); }}
              className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Calendar
        </h2>
        {loading ? (
          <div className="h-[600px] rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500">
            Loading…
          </div>
        ) : (
          <Calendar
            events={events}
            onSelectEvent={handleSelectEvent}
            onRangeChange={handleRangeChange}
            readOnly
          />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          My bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            No upcoming bookings.
          </p>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {b.event.title}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {format(new Date(b.event.start), "PPp")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
