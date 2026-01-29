"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const MapSection = dynamic(
  () => import("@/components/map-section").then((m) => m.MapSection),
  { ssr: false }
);

export function Footer() {
  return (
    <footer className="border-t-2 border-[var(--hmr-leaf-pale)] bg-[var(--hmr-forest)] text-[var(--hmr-bg-text)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="hmr-display text-lg text-[var(--hmr-bg-text)]">
              Hold My Reformer
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--hmr-border-light)]">
              Grounded vitality — movement stilled into elegant form. Book your
              Pilates reformer session with us.
            </p>
          </div>
          <div>
            <h3 className="hmr-display text-lg text-[var(--hmr-bg-text)]">
              Quick links
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/" className="font-medium text-[var(--hmr-border-light)] transition hover:text-[var(--hmr-bamboo)]">
                  Calendar
                </Link>
              </li>
              <li>
                <Link href="/reserve" className="font-medium text-[var(--hmr-border-light)] transition hover:text-[var(--hmr-bamboo)]">
                  Reserve a session
                </Link>
              </li>
              <li>
                <Link href="/health-history" className="font-medium text-[var(--hmr-border-light)] transition hover:text-[var(--hmr-bamboo)]">
                  Health history
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="hmr-display text-lg text-[var(--hmr-bg-text)]">
              Find us
            </h3>
            <div className="mt-2 h-40 overflow-hidden rounded-[var(--hmr-radius)] border-2 border-[var(--hmr-forest-light)]">
              <MapSection />
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-[var(--hmr-forest-light)] pt-6 text-center text-sm text-[var(--hmr-text-muted)]">
          © {new Date().getFullYear()} Hold My Reformer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
