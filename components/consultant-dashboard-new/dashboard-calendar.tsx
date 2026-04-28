"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "../homepage/ui/button";
import { APP_ROUTES } from "@/utils/app_routes";
import { usePathname } from "next/navigation";

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
];

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function isoKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getInitials(name?: string) {
  if (!name) return "NA";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export type DashboardCalendarEvent = {
  date: string;
  dateTime: string;
  title: string;
  time: string;
  location: string;
  badge: string;
  clientName: string;
  projectName: string;
};

/** `month` is 0–11, same as `Date#getMonth()`. */
export type DashboardCalendarMonthPayload = {
  year: number;
  month: number;
};

export type DashboardCalendarDateClickPayload = {
  /** `YYYY-MM-DD` */
  dateKey: string;
  year: number;
  month: number;
  day: number;
  isCurrentMonth: boolean;
  events: DashboardCalendarEvent[];
};

export type DashboardCalendarProps = {
  events: DashboardCalendarEvent[];
  /** "View Details" link; omit to hide the link */
  viewDetailsHref?: string;
  className?: string;
  /** Compact header: month/year title + prev/next only (no Today / Last 8 / month picker) */
  showSmallHeader?: boolean;
  /** Fired when the visible month/year changes (navigation, picker, Today, Last 8). */
  onMonthChange?: (payload: DashboardCalendarMonthPayload) => void;
  /**
   * Fired when any day cell is clicked. When set, the default event popup is not shown;
   * use `events` on the payload to build your own UI.
   */
  onDateClick?: (payload: DashboardCalendarDateClickPayload) => void;
};

export function DashboardCalendar({
  events,
  viewDetailsHref,
  className,
  showSmallHeader = false,
  onMonthChange,
  onDateClick,
}: DashboardCalendarProps) {
  const pathname = usePathname()
  const today = new Date();
  const todayKey = isoKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, DashboardCalendarEvent[]>();
    events.forEach((ev) => {
      if (!ev?.date) return;
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    });
    return map;
  }, [events]);

  const eventDateKeys = useMemo(() => {
    const keys = new Set<string>();
    eventsByDate.forEach((_, key) => keys.add(key));
    return keys;
  }, [eventsByDate]);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [popupEvent, setPopupEvent] = useState<DashboardCalendarEvent | null>(
    null,
  );
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(currentDate.getMonth());
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    function handleOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [pickerOpen]);

  useEffect(() => {
    if (!popupEvent) return;
    function handleOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectedKey(null);
        setPopupEvent(null);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [popupEvent]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    onMonthChange?.({ year, month });
  }, [year, month, onMonthChange]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: {
    day: number;
    isCurrentMonth: boolean;
    year: number;
    month: number;
  }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    days.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      year: y,
      month: m,
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true, year, month });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    days.push({ day: i, isCurrentMonth: false, year: y, month: m });
  }

  function handleDayClick(
    e: React.MouseEvent<HTMLDivElement>,
    dayObj: {
      day: number;
      isCurrentMonth: boolean;
      year: number;
      month: number;
    },
  ) {
    const key = isoKey(dayObj.year, dayObj.month, dayObj.day);
    const dayEvents = eventsByDate.get(key) ?? [];

    if (onDateClick) {
      onDateClick({
        dateKey: key,
        year: dayObj.year,
        month: dayObj.month,
        day: dayObj.day,
        isCurrentMonth: dayObj.isCurrentMonth,
        events: dayEvents,
      });
      return;
    }

    const event = dayEvents[0];
    if (!event) return;

    if (selectedKey === key) {
      setSelectedKey(null);
      setPopupEvent(null);
      return;
    }

    const cell = e.currentTarget;
    const grid = gridRef.current;
    if (grid) {
      const cellRect = cell.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      const col = Math.round((cellRect.left - gridRect.left) / cellRect.width);

      const left = col >= 4 ? undefined : cellRect.left - gridRect.left;
      const right = col >= 4 ? gridRect.right - cellRect.right : undefined;
      const top = cellRect.bottom - gridRect.top + 6;

      setPopupStyle({
        top,
        left: left !== undefined ? left : undefined,
        right: right !== undefined ? right : undefined,
      });
    }

    setSelectedKey(key);
    setPopupEvent(event);
  }

  function closePopup() {
    setSelectedKey(null);
    setPopupEvent(null);
  }

  function openPicker() {
    setPickerMonth(month);
    setPickerYear(year);
    setPickerOpen(true);
  }

  function applyPicker() {
    setCurrentDate(new Date(pickerYear, pickerMonth, 1));
    setSelectedKey(null);
    setPopupEvent(null);
    setPickerOpen(false);
  }

  function goToday() {
    setCurrentDate(new Date());
    setSelectedKey(null);
    setPopupEvent(null);
    setPickerOpen(false);
  }

  function goLast8() {
    const t = new Date();
    t.setDate(t.getDate() - 7);
    setCurrentDate(t);
    setSelectedKey(null);
    setPopupEvent(null);
    setPickerOpen(false);
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedKey(null);
    setPopupEvent(null);
    setPickerOpen(false);
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedKey(null);
    setPopupEvent(null);
    setPickerOpen(false);
  }

  const popupLabel = popupEvent
    ? (() => {
        const [y, m, d] = popupEvent.date.split("-").map(Number);
        return popupEvent.date === todayKey
          ? `Today, ${MONTHS[m - 1]} ${d}`
          : new Date(y, m - 1, d).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            });
      })()
    : "";

  return (
    <div className={`${className}`}>
      {showSmallHeader ? (
        <div className="flex items-center justify-between mb-4 px-0.5">
          <h3 className="text-base font-semibold text-slate-900 font-manrope">
            {MONTHS[month]} {year}
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100/80 text-slate-600 transition hover:bg-slate-200/80"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100/80 text-slate-600 transition hover:bg-slate-200/80"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
      <div className="flex items-center justify-between flex-wrap mb-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="rounded-md bg-brand-yellow text-[12px] text-[#5A5A5A] border-none"
            onClick={goToday}
          >
            Today
          </Button>
          <Button
            variant="outline"
            className="rounded-md bg-brand-yellow text-[12px] text-[#5A5A5A] border-none"
            onClick={goLast8}
          >
            Last 8 days
          </Button>
          <div className="relative" ref={pickerRef}>
            <Button
              variant="outline"
              className="rounded-md px-3 flex items-center gap-2 bg-white border border-brand-blue"
              onClick={openPicker}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                className="opacity-60 flex-shrink-0"
              >
                <rect
                  x="1"
                  y="3"
                  width="14"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 1v4M11 1v4M1 7h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-medium text-[12px]">
                {SHORT_MONTHS[month]} {year}
              </span>
              <ChevronDown
                className="w-4 h-4 opacity-50 transition-transform duration-200"
                style={{
                  transform: pickerOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Button>

            {pickerOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50">
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    className="text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1 text-base"
                    onClick={() => setPickerYear((y) => y - 1)}
                  >
                    ‹
                  </button>
                  <span className="text-sm font-medium text-gray-800">
                    {pickerYear}
                  </span>
                  <button
                    type="button"
                    className="text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1 text-base"
                    onClick={() => setPickerYear((y) => y + 1)}
                  >
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1 mb-3">
                  {SHORT_MONTHS.map((m, i) => {
                    const isPicked = i === pickerMonth;
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPickerMonth(i)}
                        className={`py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          isPicked
                            ? "bg-[#3088B7] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    className="flex-1 py-1.5 rounded-xl text-xs border border-gray-200 text-gray-500 hover:bg-gray-50"
                    onClick={() => setPickerOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-1.5 rounded-xl text-xs bg-[#3088B7] text-white font-medium hover:bg-[#2577a3]"
                    onClick={applyPicker}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-[60px] flex gap-2 items-center justify-between">
            <Button
              variant="outline"
              className="rounded-md w-8 h-8 p-0 flex items-center justify-center border-none"
              onClick={prevMonth}
            >
              ‹
            </Button>
            <Button
              variant="outline"
              className="rounded-md w-8 h-8 p-0 bg-brand-yellow flex items-center justify-center border-none"
              onClick={nextMonth}
            >
              ›
            </Button>
          </div>
        </div>
      </div>
      )}

      <div className="mb-6 md:bg-transparent bg-white md:rounded-none rounded-box-xl md:p-0 p-3">
        {pathname.includes('dashboard') && (
          <div className='md:hidden flex justify-between items-center mb-4'>
            <div className="flex items-center gap-2">
              <div className="bg-[#4A7BB51A] rounded-xl p-2">
                <Calendar className="w-5 h-5 text-[#3088B7]" />
              </div>
              <p className="font-medium text-sm text-gray-900 font-neue">Calendar</p>
            </div>
            <a
              href={APP_ROUTES.CONSULTANT.CALENDAR}
              className="text-xs font-manrope font-semibold text-brand-blue hover:text-[#2670A0]"
            >
              View All
            </a>
          </div>
        )}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] md:text-[10px] font-semibold text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 relative" ref={gridRef}>
          {days.map((dayObj) => {
            const key = isoKey(dayObj.year, dayObj.month, dayObj.day);
            const hasEvent = eventDateKeys.has(key);
            const isToday = key === todayKey;
            const isSelected = selectedKey === key;
            const pointer =
              hasEvent || onDateClick ? "cursor-pointer" : "cursor-default";

            return (
              <div
                key={key}
                onClick={(e) => handleDayClick(e, dayObj)}
                className={`aspect-square min-w-[25px] flex flex-col items-center  justify-center rounded-sm md:rounded-[9px] text-xs font-medium transition-colors
                    ${
                      isSelected
                        ? "bg-[#3088B7] text-white"
                        : isToday
                          ? "border border-[#3088B7] text-[#3088B7]"
                          : dayObj.isCurrentMonth
                            ? "text-gray-700"
                            : "text-gray-300"
                    }
                    ${
                      !isSelected && hasEvent
                        ? "bg-brand-blue text-white hover:opacity-80"
                        : ""
                    }
                    ${
                      !isSelected && !hasEvent && onDateClick
                        ? "hover:bg-slate-100"
                        : ""
                    }
                    ${!isSelected && !hasEvent ? "bg-[#00000005]" : ""}
                    ${pointer}
                  `}
              >
                {hasEvent ? (
                  <span
                    className="w-1 h-1 bg-white rounded-full mb-0.5 block"
                    style={{
                      background: isSelected
                        ? "rgba(255,255,255,0.7)"
                        : "white",
                    }}
                  />
                ) : (
                  <span className="h-1.5 block" />
                )}
                <span>{dayObj.day}</span>
              </div>
            );
          })}

          {popupEvent ? (
            <div
              ref={popupRef}
              className="absolute z-40 w-56 bg-[#1A4B65] rounded-lg p-3 text-white font-manrope"
              style={popupStyle}
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/20 pb-2">
                <div className="flex items-center gap-2 ">
                  <Calendar className="w-4 h-4" />
                  <span className="text-nano font-medium leading-tight">
                    {popupLabel}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-white/80 hover:text-white text-lg leading-none ml-1 flex-shrink-0"
                  onClick={closePopup}
                >
                  ×
                </button>
              </div>

              <div className="rounded-xl mb-3">
                <p className="text-nano w-fit px-2 py-1 font-medium mb-2 rounded-2xl bg-[#378ADD38] text-[#78B4F5]">
                  {popupEvent.badge}
                </p>
                <p className="text-xs font-semibold leading-tight">
                  {popupEvent.title}
                </p>
                <p className="text-nano opacity-90 mt-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {popupEvent.time}
                </p>
                <p className="text-nano opacity-80 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {popupEvent.location}
                </p>
              </div>

              <div className="bg-[#2C6B8B] rounded-lg px-3 py-2.5 mb-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1C4C2B] text-[#9EE2A8] text-xs font-semibold flex items-center justify-center">
                  {getInitials(popupEvent.clientName)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white font-medium truncate">
                    {popupEvent.clientName}
                  </p>
                  <p className="text-[8px] text-white/75 truncate">
                    {popupEvent.projectName}
                  </p>
                </div>
              </div>

              {viewDetailsHref ? (
                <a
                  href={viewDetailsHref}
                  className="block bg-white w-full px-2 py-2 text-center text-[#0891B2] rounded-lg text-xs font-semibold hover:bg-gray-100"
                >
                  View Details →
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
