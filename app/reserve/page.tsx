"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { getMockSessionsForMonth, getMockSessionById } from "@/lib/mock-sessions";
import { format } from "date-fns";

const STORAGE_KEY_RESERVATION = "hmr_reservation";

function ReserveContent() {
  const searchParams = useSearchParams();
  const slotId = searchParams.get("slot");

  const [creditsUsed, setCreditsUsed] = useState(1);
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const slot = useMemo(() => {
    if (!slotId) return null;
    return getMockSessionById(slotId);
  }, [slotId]);

  const sessions = useMemo(() => {
    const now = new Date();
    return getMockSessionsForMonth(now.getFullYear(), now.getMonth() + 1);
  }, []);

  const selectedSlot = slot ?? sessions[0] ?? null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot || !agree) return;
    const reservation = {
      slotId: selectedSlot.id,
      title: selectedSlot.title,
      date: selectedSlot.date.toISOString(),
      type: selectedSlot.type,
      creditsUsed: creditsUsed || selectedSlot.creditsRequired,
      reservedAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_RESERVATION, JSON.stringify(reservation));
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="hmr-card bg-[var(--hmr-light)]/50 p-6 text-center hmr-animate-in">
          <p className="text-2xl font-medium text-[var(--hmr-text)]">
            Your reservation has been received.
          </p>
          <Link
            href="/confirmation"
            className="hmr-btn-primary mt-4 inline-block px-6 py-2.5 text-sm"
          >
            View confirmation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="hmr-display text-3xl sm:text-4xl">
        Reserve your session
      </h1>
      <p className="mt-2 text-[var(--hmr-bg-text)]/90">
        Confirm your spot and pay with credit.
      </p>

      {!selectedSlot ? (
        <div className="hmr-card mt-8 p-6">
          <p className="text-[var(--hmr-text-muted)]">
            No session selected.{" "}
            <Link href="/" className="text-[var(--hmr-leaf)] underline hover:text-[var(--hmr-leaf-bright)] transition">
              Choose a session from the calendar
            </Link>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="hmr-card p-6">
            <h2 className="hmr-display text-xl text-[var(--hmr-text)]">
              {selectedSlot.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--hmr-text-muted)]">
              {format(new Date(selectedSlot.date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </p>
            <p className="mt-1 text-sm capitalize text-[var(--hmr-text)]">
              {selectedSlot.type} · {selectedSlot.durationMinutes} minutes
            </p>
          </div>

          <div className="hmr-card p-6">
            <label className="block text-sm font-medium text-[var(--hmr-text)]">
              Credits to use
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={creditsUsed}
              onChange={(e) => setCreditsUsed(parseInt(e.target.value, 10) || 1)}
              className="mt-2 w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
            />
            <p className="mt-1 text-xs text-[var(--hmr-text-muted)]">
              This session requires {selectedSlot.creditsRequired} credit
              {selectedSlot.creditsRequired !== 1 ? "s" : ""}.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[var(--hmr-neutral)] text-[var(--hmr-primary)]"
            />
            <label htmlFor="agree" className="text-sm text-[var(--hmr-bg-text)]">
              I agree to pay with my credits and understand that my reservation
              is confirmed upon submission.
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!agree}
              className="hmr-btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
            >
              Confirm reservation
            </button>
            <Link
              href="/"
              className="hmr-btn-secondary px-6 py-2.5 text-sm font-medium"
            >
              Back to calendar
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ReservePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-12 text-center text-[var(--hmr-bg-text)]/80">
          Loading…
        </div>
      }
    >
      <ReserveContent />
    </Suspense>
  );
}
