import { CalendarView } from "@/components/calendar-view";
import { HeroStrip } from "@/components/hero-strip";

export default function CalendarPage() {
  return (
    <>
      <HeroStrip
        title="Hold My Reformer"
        subtitle="Grounded vitality — movement stilled into elegant form."
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <h1 className="hmr-display text-3xl sm:text-4xl hmr-animate-in">
          Available sessions
        </h1>
        <p className="mt-2 font-medium text-[var(--hmr-bg-text)]/90 hmr-animate-in" style={{ animationDelay: "0.05s" }}>
          Click a session to see details and reserve your spot.
        </p>
        <div className="hmr-animate-in" style={{ animationDelay: "0.1s" }}>
          <CalendarView />
        </div>
      </div>
    </>
  );
}
