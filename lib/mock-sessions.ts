import { addDays, setHours, setMinutes, startOfMonth, startOfWeek } from "date-fns";

export type SessionSlot = {
  id: string;
  date: Date;
  title: string;
  type: "reformer" | "mat" | "private";
  durationMinutes: number;
  spotsTotal: number;
  spotsLeft: number;
  creditsRequired: number;
};

function slot(
  id: string,
  date: Date,
  title: string,
  type: SessionSlot["type"],
  duration: number,
  total: number,
  left: number,
  credits: number
): SessionSlot {
  return {
    id,
    date: new Date(date),
    title,
    type,
    durationMinutes: duration,
    spotsTotal: total,
    spotsLeft: left,
    creditsRequired: credits,
  };
}

export function getMockSessionsForMonth(year: number, month: number): SessionSlot[] {
  const slots: SessionSlot[] = [];
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const configs = [
    { title: "Reformer foundations", type: "reformer" as const, h: 9, m: 0, dur: 55, total: 6, left: 4, credits: 1 },
    { title: "Mat & flow", type: "mat" as const, h: 10, m: 0, dur: 50, total: 8, left: 2, credits: 1 },
    { title: "Private session", type: "private" as const, h: 9, m: 30, dur: 60, total: 1, left: 1, credits: 2 },
  ] as const;
  for (let w = 0; w < 5; w++) {
    const mon = addDays(weekStart, w * 7);
    const wed = addDays(mon, 2);
    const fri = addDays(mon, 4);
    const days = [mon, wed, fri];
    days.forEach((d, i) => {
      if (d.getMonth() !== month - 1) return;
      const c = configs[i];
      const date = setMinutes(setHours(d, c.h), c.m);
      slots.push(
        slot(`s-${date.getTime()}`, date, c.title, c.type, c.dur, c.total, c.left, c.credits)
      );
    });
  }
  return slots;
}

export function getMockSessionById(id: string): SessionSlot | null {
  const now = new Date();
  for (let m = -1; m <= 1; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() + m, 1);
    const sessions = getMockSessionsForMonth(d.getFullYear(), d.getMonth() + 1);
    const found = sessions.find((s) => s.id === id);
    if (found) return found;
  }
  return null;
}
