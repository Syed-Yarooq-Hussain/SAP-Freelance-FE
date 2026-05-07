"use client";

import { useConsultantCalendar } from "@/actions/consultants/useConsultantCalendar";
import type { ApiDay } from "@/types/calendar";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AvailabilitySlotPayload = {
  start: string;
  end: string;
};

type AvailabilityDayPayload = {
  date: string;
  active: boolean;
  slot: AvailabilitySlotPayload[];
};

export type AvailabilitySavePayload = AvailabilityDayPayload[];

interface AvailabilityCalendarProps {
  onSave: (payload: AvailabilitySavePayload) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type DragMode = "select" | "deselect";

interface DragState {
  active: boolean;
  key: string | null;
  mode: DragMode | null;
  lastH: number | null;
}

/** Internal grid key: `DD-MM-YYYY` */
function toKey(y: number, m: number, d: number): string {
  return `${String(d).padStart(2, "0")}-${String(m + 1).padStart(2, "0")}-${y}`;
}

function fromKey(k: string): { d: number; m: number; y: number } {
  const [d, m, y] = k.split("-").map(Number);
  return { d, m: m - 1, y };
}

/** `YYYY-MM-DD` → grid key */
function isoDateToGridKey(iso: string): string {
  const [Y, M, D] = iso.split("-").map(Number);
  if (!Y || !M || !D) return iso;
  return toKey(Y, M - 1, D);
}

/** Grid key → `YYYY-MM-DD` */
function gridKeyToIso(key: string): string {
  const { d, m, y } = fromKey(key);
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function dayNameFromIso(iso: string): string {
  const [Y, M, D] = iso.split("-").map(Number);
  const dt = new Date(Y, M - 1, D);
  return dt.toLocaleDateString("en-US", { weekday: "long" });
}

/** API slot → hour indices `0..23` (half-open `[start, end)` by hour). */
function slotToHourIndices(start_time: string, end_time: string): number[] {
  const parseH = (s: string) => {
    const [h, m] = s.split(":").map((x) => Number(x));
    return {
      h: Number.isFinite(h) ? Math.min(23, Math.max(0, h)) : 0,
      m: Number.isFinite(m) ? m : 0,
    };
  };
  const s = parseH(start_time);
  const e = parseH(end_time);
  let endExclusive = e.h + (e.m > 0 ? 1 : 0);
  endExclusive = Math.min(24, Math.max(0, endExclusive));
  const out: number[] = [];
  for (let h = s.h; h < endExclusive && h < 24; h++) out.push(h);
  return out;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Selected hours → payload `slot` (consecutive hours merged). */
function buildCustomSlots(hours: Set<number>): AvailabilitySlotPayload[] {
  const sorted = [...hours].sort((a, b) => a - b);
  if (!sorted.length) return [];
  const slots: AvailabilitySlotPayload[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
    } else {
      slots.push({
        start: `${pad2(start)}:00`,
        end: `${pad2(prev + 1)}:00`,
      });
      start = sorted[i];
      prev = sorted[i];
    }
  }
  slots.push({
    start: `${pad2(start)}:00`,
    end: `${pad2(prev + 1)}:00`,
  });
  return slots;
}

function hydrateFromApiDays(days: ApiDay[]): {
  dates: Set<string>;
  hours: Record<string, Set<number>>;
} {
  const dates = new Set<string>();
  const hours: Record<string, Set<number>> = {};
  for (const day of days) {
    const active =
      "active" in day
        ? Boolean(day.active)
        : Boolean((day as unknown as { availability?: { available?: boolean } }).availability?.available);
    const slots =
      "slots" in day && Array.isArray(day.slots)
        ? day.slots
        : ((day as unknown as { availability?: { slots?: { start_time: string; end_time: string }[] } }).availability?.slots ?? []);
    if (!active || !slots.length) continue;
    const key = isoDateToGridKey(day.date);
    dates.add(key);
    const set = new Set<number>();
    for (const slot of slots) {
      slotToHourIndices(slot.start_time, slot.end_time).forEach((h) =>
        set.add(h),
      );
    }
    hours[key] = set;
  }
  return { dates, hours };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CalendarProps {
  year: number;
  month: number;
  selectedDates: Set<string>;
  onToggleDate: (key: string) => void;
  isDateDisabled: (key: string) => boolean;
  onPrev: () => void;
  onNext: () => void;
}

function Calendar({
  year,
  month,
  selectedDates,
  onToggleDate,
  isDateDisabled,
  onPrev,
  onNext,
}: CalendarProps) {
  const today = new Date();
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onPrev}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-800 tracking-wide">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={onNext}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold text-gray-400 pb-1.5 tracking-widest uppercase"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: first }, (_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const key = toKey(year, month, d);
          const isSelected = selectedDates.has(key);
          const isDisabled = isDateDisabled(key);
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === d;

          return (
            <div
              key={d}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (isDisabled) return;
                onToggleDate(key);
              }}
              onKeyDown={(e) => {
                if (isDisabled) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleDate(key);
                }
              }}
              className={[
                "text-center sm:w-8 xl:w-12 sm:h-8 xl:h-12 flex items-center justify-center text-xs py-1.5 rounded-lg cursor-pointer select-none transition-colors",
                isDisabled
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed hover:bg-gray-100"
                  : "",
                isSelected
                  ? "bg-brand-blue text-white font-semibold"
                  : isToday
                    ? "border-2 border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white"
                    : "text-gray-700 hover:bg-gray-100",
              ].join(" ")}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TimeGridProps {
  sortedDates: string[];
  selectedHours: Record<string, Set<number>>;
  isDateDisabled: (key: string) => boolean;
  onToggleHour: (key: string, h: number, mode: DragMode) => void;
}

function TimeGrid({
  sortedDates,
  selectedHours,
  isDateDisabled,
  onToggleHour,
}: TimeGridProps) {
  const dragRef = useRef<DragState>({
    active: false,
    key: null,
    mode: null,
    lastH: null,
  });

  const handleMouseDown = useCallback(
    (key: string, h: number) => {
      if (isDateDisabled(key)) return;
      const currently = (selectedHours[key] || new Set<number>()).has(h);
      const mode: DragMode = currently ? "deselect" : "select";
      dragRef.current = { active: true, key, mode, lastH: h };
      onToggleHour(key, h, mode);
    },
    [isDateDisabled, selectedHours, onToggleHour],
  );

  const handleMouseEnter = useCallback(
    (key: string, h: number) => {
      if (isDateDisabled(key)) return;
      const { active, key: dk, mode, lastH } = dragRef.current;
      if (!active || dk !== key || h === lastH || !mode) return;
      dragRef.current.lastH = h;
      onToggleHour(key, h, mode);
    },
    [isDateDisabled, onToggleHour],
  );

  const handleMouseUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  if (!sortedDates.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
        <div className="text-4xl mb-2">📅</div>
        <p className="text-sm text-gray-400">
          Select dates from the calendar to begin
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex" style={{ minWidth: "fit-content" }}>
        <div className="w-12 flex-shrink-0 pt-10">
          {Array.from({ length: 24 }, (_, h) => (
            <div
              key={h}
              className="h-8 flex items-center justify-end pr-2 text-[10px] text-gray-400 font-medium"
            >
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {sortedDates.map((key) => {
          const isDisabled = isDateDisabled(key);
          const { d, m, y } = fromKey(key);
          const label = new Date(y, m, d).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
          const hours = selectedHours[key] || new Set<number>();

          return (
            <div key={key} className="w-24 flex-shrink-0 mr-1">
              <div className="h-10 flex items-center justify-center text-[11px] font-bold text-gray-600 border-b border-gray-100 text-center tracking-tight">
                {label}
              </div>
              {Array.from({ length: 24 }, (_, h) => {
                const sel = hours.has(h);
                return (
                  <div
                    key={h}
                    className={[
                      "h-8 rounded mb-px border cursor-pointer transition-colors",
                      isDisabled
                        ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                        : "",
                      sel
                        ? "bg-brand-blue border-brand-blue"
                        : "bg-gray-50 border-gray-100 hover:bg-brand-blue hover:border-brand-blue",
                    ].join(" ")}
                    onMouseDown={() => handleMouseDown(key, h)}
                    onMouseEnter={() => handleMouseEnter(key, h)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AvailabilityCalendar({ onSave }: AvailabilityCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());
  const [selectedDates, setSelectedDates] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectedHours, setSelectedHours] = useState<
    Record<string, Set<number>>
  >({});

  const { data, isLoading } = useConsultantCalendar(month, year);

  const isDateDisabled = useCallback((key: string) => {
    const { d, m, y } = fromKey(key);
    const dateOnly = new Date(y, m, d);
    dateOnly.setHours(0, 0, 0, 0);
    const todayOnly = new Date();
    todayOnly.setHours(0, 0, 0, 0);
    return dateOnly < todayOnly;
  }, []);

  useEffect(() => {
    if (!data) return;
    const { dates, hours } = hydrateFromApiDays(data.days ?? []);
    // Keep past dates non-editable by excluding them from selected state.
    const filteredDates = new Set([...dates].filter((k) => !isDateDisabled(k)));
    const filteredHours = Object.fromEntries(
      Object.entries(hours).filter(([k]) => !isDateDisabled(k)),
    ) as Record<string, Set<number>>;
    setSelectedDates(filteredDates);
    setSelectedHours(filteredHours);
  }, [data, isDateDisabled]);

  const handleToggleDate = useCallback((key: string) => {
    if (isDateDisabled(key)) return;
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        setSelectedHours((h) => {
          const n = { ...h };
          delete n[key];
          return n;
        });
      } else {
        next.add(key);
      }
      return next;
    });
  }, [isDateDisabled]);

  const handleToggleHour = useCallback(
    (key: string, h: number, mode: DragMode) => {
      setSelectedHours((prev) => {
        const set = new Set<number>(prev[key] || []);
        if (mode === "select") set.add(h);
        else set.delete(h);
        return { ...prev, [key]: set };
      });
    },
    [],
  );

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };
  const handleClearAll = () => {
    setSelectedDates(new Set());
    setSelectedHours({});
  };

  const sortedDates = [...selectedDates].sort((a, b) => {
    const A = fromKey(a);
    const B = fromKey(b);
    return new Date(A.y, A.m, A.d).getTime() - new Date(B.y, B.m, B.d).getTime();
  });

  const payload: AvailabilitySavePayload = sortedDates
    .map((key) => {
      if (isDateDisabled(key)) return null;
      const iso = gridKeyToIso(key);
      const slots = buildCustomSlots(selectedHours[key] || new Set<number>());
      if (!slots.length) return null;
      const day: AvailabilityDayPayload = {
        date: iso,
        active: true,
        slot: slots,
      };
      return day;
    })
    .filter((d): d is AvailabilityDayPayload => d !== null);

  const handleSave = () => {
    onSave(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {isLoading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 text-sm text-slate-500">
          Loading schedule…
        </div>
      ) : null}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Availability Planner
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select dates, then click or drag to mark available hours
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 items-start flex-wrap">
        <div className="col-span-1 md:col-span-3 flex-shrink-0 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Select Dates
            </p>
            <Calendar
              year={year}
              month={month}
              selectedDates={selectedDates}
              onToggleDate={handleToggleDate}
              isDateDisabled={isDateDisabled}
              onPrev={handlePrev}
              onNext={handleNext}
            />
            {selectedDates.size > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="mt-3 w-full py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {sortedDates.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Selected
              </p>
              <div className="flex flex-col gap-1.5">
                {sortedDates.map((key) => {
                  const { d, m, y } = fromKey(key);
                  const label = new Date(y, m, d).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const count = (selectedHours[key] || new Set<number>()).size;
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5"
                    >
                      <span className="text-xs text-gray-600">{label}</span>
                      {count > 0 && (
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 rounded-md px-1.5 py-0.5">
                          {count}h
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1 md:col-span-7 flex-1 min-w-0 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex gap-2 items-center justify-between mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Time Slots — click or drag to select
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={payload.length === 0}
                  className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white md:text-xs text-xxs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Save Availability
                </button>
              </div>
            </div>
            <TimeGrid
              sortedDates={sortedDates}
              selectedHours={selectedHours}
              isDateDisabled={isDateDisabled}
              onToggleHour={handleToggleHour}
            />
          </div>

          
        </div>
      </div>
    </div>
  );
}
