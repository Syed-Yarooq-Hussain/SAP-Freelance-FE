export const today = new Date();
export const currentYear = today.getFullYear();
export const currentMonth = today.getMonth();

export const getCurrentMonth = (): string => {
  const date = new Date();
  return date.toLocaleString("default", { month: "long" });
};

export const yearsAround = (center: number, span = 10): number[] =>
  Array.from({ length: span * 2 + 1 }, (_, i) => center - span + i);
export const formatMonthYear = (year: number, month: number): string =>
  new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

export const firstWeekdayIndex = (year: number, month: number): number => {
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
};

export const ymd = (date: Date): string => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const toAmPm = (t?: string): string => {
  if (!t) return "";
  const [H, M] = t.split(":").map(Number);
  if (Number.isNaN(H) || Number.isNaN(M)) return t;
  const h = ((H + 11) % 12) + 1;
  const ampm = H < 12 ? "am" : "pm";
  return `${h}:${String(M).padStart(2, "0")} ${ampm}`;
};

export const buildMonthCells = (year: number, month: number): Date[] => {
  const totalDays = daysInMonth(year, month);
  const firstIdx = firstWeekdayIndex(year, month);
  const cells: Date[] = [];

  const prevMonth = month - 1 < 0 ? 11 : month - 1;
  const prevYear = month - 1 < 0 ? year - 1 : year;
  const prevMonthDays = daysInMonth(year, prevMonth);

  for (let i = 0; i < firstIdx; i++) {
    const day = prevMonthDays - (firstIdx - 1 - i);
    cells.push(new Date(prevYear, prevMonth, day));
  }

  for (let d = 1; d <= totalDays; d++) {
    cells.push(new Date(year, month, d));
  }

  const nextMonth = month + 1 > 11 ? 0 : month + 1;
  const nextYear = month + 1 > 11 ? year + 1 : year;
  while (cells.length % 7 !== 0) {
    const idx = cells.length - (firstIdx + totalDays);
    cells.push(new Date(nextYear, nextMonth, idx + 1));
  }

  return cells;
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const dayAfter = (d: Date) => {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + 1);
  return nd;
};

export const inRange = (d: Date, start: Date | null, end: Date | null) => {
  if (!start || !end) return false;
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(0, 0, 0, 0);
  return +t >= +s && +t <= +e;
};

export const clampToMonthStart = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), 1);

export const getSelectedDays = (
  preset: "All Day" | "Weekends" | "Weekday"
): number[] => {
  switch (preset) {
    case "Weekends":
      return [0, 6];
    case "Weekday":
      return [1, 2, 3, 4, 5];
    case "All Day":
    default:
      return [0, 1, 2, 3, 4, 5, 6];
  }
};

export const buildMonthMatrix = (view: Date): Date[][] => {
  const first = clampToMonthStart(view);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const weeks: Date[][] = [];
  let cursor = start;
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(new Date(cursor));
      cursor = dayAfter(cursor);
    }
    weeks.push(row);
  }
  return weeks;
};

export const formatYMD = (iso: string) => {
  if (!iso) return "N/A";
  return iso.split("T")[0];
};

export const formatDateTimeAmPm = (iso: string) => {
  if (!iso) return "N/A";

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "N/A";
  const date = d.toISOString().split("T")[0];

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${date} - ${hours}:${minutes} ${ampm}`;
};

export const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
};

export const calculateDurationHours = (start: string, end: string): number => {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);

  if (endMin <= startMin) return 0;

  return Math.round((endMin - startMin) / 60);
};

export function isWeekendDate(dateISO: string) {
  const d = new Date(dateISO);
  const day = d.getDay();
  return day === 0 || day === 6;
}

