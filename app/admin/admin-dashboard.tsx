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
  bookings: { user: { name: string | null } }[];
};

export function AdminDashboard() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [range, setRange] = useState<{ start: Date; end: Date }>(() => {
    const now = new Date();
    return { start: startOfMonth(now), end: endOfMonth(now) };
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formSlot, setFormSlot] = useState<{ start: Date; end: Date } | null>(
    null
  );
  const [form, setForm] = useState({
    title: "",
    type: "BLOCK" as "BLOCK" | "CLASS",
    maxParticipants: 6,
    creditsRequired: 1,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadEvents = useCallback(async (start: Date, end: Date) => {
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
    }));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const evts = await loadEvents(range.start, range.end);
      setEvents(evts);
    } finally {
      setLoading(false);
    }
  }, [range, loadEvents]);

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

  const handleSelectSlot = useCallback((start: Date, end: Date) => {
    setFormSlot({ start, end });
    setForm({
      title: "",
      type: "BLOCK",
      maxParticipants: 6,
      creditsRequired: 1,
    });
    setShowForm(true);
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formSlot) return;
      setError("");
      setSaving(true);
      try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title || (form.type === "CLASS" ? "Group class" : "Private session"),
            type: form.type,
            start: formSlot.start.toISOString(),
            end: formSlot.end.toISOString(),
            maxParticipants: form.type === "CLASS" ? form.maxParticipants : 1,
            creditsRequired: form.creditsRequired,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || "Failed to create event");
          return;
        }
        setShowForm(false);
        setFormSlot(null);
        load();
      } finally {
        setSaving(false);
      }
    },
    [formSlot, form, load]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Hold My Reformer
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-0.5">
            Admin · Manage calendar
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/health-history"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm"
          >
            Health history forms
          </Link>
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

      {showForm && formSlot && (
        <div className="mb-6 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Add session
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {format(formSlot.start, "PPp")} – {format(formSlot.end, "p")}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder={form.type === "CLASS" ? "Group class" : "Private session"}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as "BLOCK" | "CLASS",
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
              >
                <option value="BLOCK">Private session (1:1)</option>
                <option value="CLASS">Group class</option>
              </select>
            </div>
            {form.type === "CLASS" && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Max participants
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.maxParticipants}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      maxParticipants: parseInt(e.target.value, 10) || 1,
                    }))
                  }
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Credits per booking
              </label>
              <input
                type="number"
                min={1}
                value={form.creditsRequired}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    creditsRequired: parseInt(e.target.value, 10) || 1,
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Adding…" : "Add session"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormSlot(null);
                  setError("");
                }}
                className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Calendar · Click a time slot to add a session
        </h2>
        {loading ? (
          <div className="h-[600px] rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500">
            Loading…
          </div>
        ) : (
          <Calendar
            events={events}
            onSelectSlot={handleSelectSlot}
            onRangeChange={handleRangeChange}
            readOnly={false}
          />
        )}
      </section>
    </div>
  );
}
