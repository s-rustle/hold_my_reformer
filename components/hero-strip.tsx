"use client";

type Props = {
  title?: string;
  subtitle?: string;
};

export function HeroStrip({
  title = "Hold My Reformer",
  subtitle = "Grounded vitality — movement stilled into elegant form.",
}: Props) {
  return (
    <div className="relative border-b-2 border-[var(--hmr-leaf-pale)] bg-[var(--hmr-forest)] px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-6xl text-center">
        <h1 className="hmr-display text-4xl tracking-tight text-[var(--hmr-bg-text)] sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-4 text-base font-medium uppercase tracking-widest text-[var(--hmr-bamboo)] sm:text-lg">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
