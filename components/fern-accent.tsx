"use client";

type Props = {
  className?: string;
  opacity?: number;
};

/** Subtle fern/leaf silhouette — decorative only, for forest identity */
export function FernAccent({ className = "", opacity = 0.12 }: Props) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 80 120"
        fill="currentColor"
        className="text-[var(--hmr-text)]"
        style={{ opacity }}
      >
        <path d="M40 4c-2 8-8 24-12 40-2 8-4 20-4 28 0 6 2 12 6 16 2 2 6 4 10 4 4 0 8-2 10-4 4-4 6-10 6-16 0-8-2-20-4-28C48 28 42 12 40 4zm0 20c4 12 8 28 8 40 0 8-2 14-6 18-2 2-4 2-6 0-4-4-6-10-6-18 0-12 4-28 8-40z" />
        <path d="M36 20c0 4-2 10-4 16l-2 8c0 2 0 4 2 6 2 2 4 2 6 0 2-2 2-4 2-6l-2-8c-2-6-4-12-4-16 0-2-2-4-4-4s-4 2-4 4z" opacity={0.7} />
      </svg>
    </div>
  );
}
