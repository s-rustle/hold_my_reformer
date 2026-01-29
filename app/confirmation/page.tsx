"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

const STORAGE_KEY_RESERVATION = "hmr_reservation";

type Reservation = {
  slotId: string;
  title: string;
  date: string;
  type: string;
  creditsUsed: number;
  reservedAt: string;
};

export default function ConfirmationPage() {
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const read = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_RESERVATION);
        if (raw) setReservation(JSON.parse(raw));
        else setReservation(null);
      } catch {
        setReservation(null);
      }
    };
    queueMicrotask(read);
  }, []);

  if (!reservation) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="hmr-card p-8 text-center">
          <h1 className="hmr-display text-2xl text-[var(--hmr-text)]">
            No reservation found
          </h1>
          <p className="mt-2 text-[var(--hmr-text-muted)]">
            Reserve a session from the calendar to see your confirmation here.
          </p>
          <Link
            href="/"
            className="hmr-btn-primary mt-6 inline-block px-6 py-2.5 text-sm"
          >
            View calendar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="hmr-display text-3xl sm:text-4xl">
        Payment confirmed
      </h1>
      <p className="mt-2 text-xl text-[var(--hmr-bg-text)]/95">
        Thank you — your session is reserved.
      </p>

      <div className="hmr-card mt-8 p-6 hmr-pulse">
        <div className="flex items-center justify-center rounded-full bg-[var(--hmr-leaf)]/25 p-4">
          <span className="text-4xl text-[var(--hmr-leaf)]">✓</span>
        </div>
        <h2 className="hmr-display mt-4 text-center text-xl text-[var(--hmr-text)]">
          {reservation.title}
        </h2>
        <p className="mt-2 text-center text-[var(--hmr-text-muted)]">
          {format(new Date(reservation.date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
        </p>
        <p className="mt-1 text-center text-sm capitalize text-[var(--hmr-text)]">
          {reservation.type}
        </p>
        <div className="mt-4 flex justify-center gap-6 border-t border-[var(--hmr-card-border)] pt-4 text-sm">
          <span className="text-[var(--hmr-text-muted)]">
            <strong className="text-[var(--hmr-text)]">{reservation.creditsUsed}</strong>{" "}
            credit{reservation.creditsUsed !== 1 ? "s" : ""} applied
          </span>
          <span className="text-[var(--hmr-text-muted)]">
            Confirmed {format(new Date(reservation.reservedAt), "MMM d, h:mm a")}
          </span>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-[var(--hmr-bg-text)]/90">
        We look forward to seeing you on the reformer.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/"
          className="hmr-btn-primary px-6 py-2.5 text-sm"
        >
          Book another session
        </Link>
        <Link
          href="/reserve"
          className="hmr-btn-secondary px-6 py-2.5 text-sm font-medium"
        >
          Reserve
        </Link>
      </div>
    </div>
  );
}
