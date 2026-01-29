"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type HealthHistoryRecord = {
  id: string;
  userId: string;
  formData: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string };
};

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function FormDetail({ formData }: { formData: string }) {
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(formData) as Record<string, unknown>;
  } catch {
    return <p className="text-sm text-zinc-500">Invalid form data</p>;
  }
  const entries = Object.entries(data).filter(([, v]) => {
    if (v === "" || v === null || v === undefined) return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  });
  return (
    <div className="grid gap-2 text-sm">
      {entries.map(([key, value]) => (
        <div key={key} className="border-b border-zinc-200 dark:border-zinc-700 pb-2 last:border-0">
          <span className="font-medium text-zinc-700 dark:text-zinc-300 block mb-0.5">
            {formatLabel(key)}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400">
            {Array.isArray(value) ? value.join(", ") : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AdminHealthHistoryPage() {
  const [list, setList] = useState<HealthHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health-history")
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Health history forms
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-0.5">
            Submitted member health history
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm"
          >
            Admin dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm"
          >
            Sign out
          </button>
        </div>
      </header>

      {loading ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 text-center text-zinc-500">
          Loading…
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 text-center text-zinc-500">
          No health history forms submitted yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((record) => (
            <li
              key={record.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {record.user.name || "—"}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {record.user.email}
                  </p>
                </div>
                <div className="text-sm text-zinc-500">
                  {new Date(record.updatedAt).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </div>
                <span className="text-zinc-400">
                  {expandedId === record.id ? "▼" : "▶"}
                </span>
              </button>
              {expandedId === record.id && (
                <div className="border-t border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50/50 dark:bg-zinc-800/30">
                  <FormDetail formData={record.formData} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
