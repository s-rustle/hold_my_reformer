"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Calendar" },
  { href: "/reserve", label: "Reserve" },
  { href: "/confirmation", label: "Confirmation" },
  { href: "/health-history", label: "Health History" },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[var(--hmr-leaf-pale)] bg-[var(--hmr-forest)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="hmr-display text-2xl tracking-tight text-[var(--hmr-bg-text)] transition hover:text-[var(--hmr-bamboo)] sm:text-3xl md:text-4xl"
        >
          Hold My Reformer
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`rounded px-3 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                  pathname === href
                    ? "bg-[var(--hmr-leaf)] text-white"
                    : "text-[var(--hmr-bg-text)] hover:bg-[var(--hmr-forest-light)] hover:text-[var(--hmr-bamboo)]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col gap-1.5 rounded p-2 hover:bg-[var(--hmr-forest-light)] md:hidden"
          aria-label="Toggle menu"
        >
          <span className="h-0.5 w-6 bg-[var(--hmr-bg-text)]" />
          <span className="h-0.5 w-6 bg-[var(--hmr-bg-text)]" />
          <span className="h-0.5 w-6 bg-[var(--hmr-bg-text)]" />
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--hmr-forest-light)] bg-[var(--hmr-forest)] px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block rounded px-3 py-2.5 text-sm font-semibold uppercase tracking-wide ${
                    pathname === href
                      ? "bg-[var(--hmr-leaf)] text-white"
                      : "text-[var(--hmr-bg-text)] hover:bg-[var(--hmr-forest-light)] hover:text-[var(--hmr-bamboo)]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
