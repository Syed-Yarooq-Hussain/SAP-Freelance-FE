"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Calendar, ChevronDown, Clock, MapPin } from "lucide-react";
import { Button } from "../homepage/ui/button";
import { StatsCards } from "./stats-card";
import { TodaySchedule } from "./today-schedule";
import { DashboardData } from "@/types/dashboard";
import { useConsultantMeetings } from "@/actions/consultants/useConsultantMeetings";
import { APP_ROUTES } from "@/utils/app_routes";
interface CalendarEvent {
  date: string;
  dateTime: string;
  title: string;
  time: string;
  location: string;
  badge: string;
  clientName: string;
  projectName: string;
}

interface ConsultantMeeting {
  date_time?: string;
  event_type?: string;
  duration?: number;
  project_name?: string;
  sender_name?: string;
  invitees_names?: string;
}

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

function toTitleCase(value?: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function getInitials(name?: string) {
  if (!name) return "NA";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function firstNonEmpty(...values: Array<string | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

export const CalendarWidget: React.FC<{ data: DashboardData }> = ({ data }) => {
  const { data: meetings } = useConsultantMeetings();
  const today = new Date();
  const todayKey = isoKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const meetingList: ConsultantMeeting[] = useMemo(() => {
    return Array.isArray(meetings?.data) ? meetings.data : [];
  }, [meetings]);

  const meetingsByDate = useMemo(() => {
    const map = new Map<string, ConsultantMeeting[]>();

    meetingList.forEach((meeting) => {
      if (typeof meeting?.date_time !== "string") return;
      const dateKey = meeting.date_time.split("T")[0];
      if (!dateKey) return;
      const dayMeetings = map.get(dateKey) ?? [];
      dayMeetings.push(meeting);
      map.set(dateKey, dayMeetings);
    });

    return map;
  }, [meetingList]);

  const meetingDateKeys = useMemo(() => {
    const keys = new Set<string>();
    meetingsByDate.forEach((_, key) => keys.add(key));

    return keys;
  }, [meetingsByDate]);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 18));
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [popupEvent, setPopupEvent] = useState<CalendarEvent | null>(null);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  // Month/year picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(currentDate.getMonth());
  const [pickerYear, setPickerYear] = useState(currentDate.getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);

  // Popup ref for positioning
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

  // Close popup on outside click
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
    const dayMeetings = meetingsByDate.get(key);
    const meeting = dayMeetings?.[0];
    if (!meeting || !meeting.date_time) return;

    const startDate = new Date(meeting.date_time);
    const endDate = new Date(
      startDate.getTime() + (Number(meeting.duration) || 0) * 60 * 1000,
    );
    const startTime = startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const endTime = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const title = firstNonEmpty(meeting.event_type) || "Meeting";
    const clientName =
      firstNonEmpty(meeting.sender_name, meeting.invitees_names) ||
      "Unknown client";
    const location =
      firstNonEmpty(meeting.project_name, meeting.sender_name, meeting.invitees_names) ||
      "Online";
    const meetingType = toTitleCase(meeting.event_type) || "Meeting";
    const event: CalendarEvent = {
      date: key,
      dateTime: meeting.date_time,
      title,
      time: `${startTime}`,
      location,
      badge: `${meetingType} Scheduled`,
      clientName,
      projectName: firstNonEmpty(meeting.project_name) || "No project",
    };

    if (selectedKey === key) {
      setSelectedKey(null);
      setPopupEvent(null);
      return;
    }

    // Position popup relative to clicked cell
    const cell = e.currentTarget;
    const grid = gridRef.current;
    if (grid) {
      const cellRect = cell.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      const col = Math.round((cellRect.left - gridRect.left) / cellRect.width);

      // Flip to left side if in last 3 columns
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
    <div className="rounded-xl p-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap mb-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="rounded-xl text-sm border-none"
            onClick={goToday}
          >
            Today
          </Button>
          <Button
            variant="outline"
            className="rounded-xl text-sm border-none"
            onClick={goLast8}
          >
            Last 8 days
          </Button>
            {/* Month/Year Picker */}
            <div className="relative" ref={pickerRef}>
              <Button
                variant="outline"
                className="rounded-xl px-3 flex items-center gap-2 bg-white border border-brand-blue"
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
                <span className="font-medium text-sm">
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
                  {/* Year row */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      className="text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1 text-base"
                      onClick={() => setPickerYear((y) => y - 1)}
                    >
                      ‹
                    </button>
                    <span className="text-sm font-medium text-gray-800">
                      {pickerYear}
                    </span>
                    <button
                      className="text-gray-500 hover:bg-gray-100 rounded-md px-2 py-1 text-base"
                      onClick={() => setPickerYear((y) => y + 1)}
                    >
                      ›
                    </button>
                  </div>

                  {/* Month grid */}
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {SHORT_MONTHS.map((m, i) => {
                      const isPicked = i === pickerMonth;
                      return (
                        <button
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

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      className="flex-1 py-1.5 rounded-xl text-xs border border-gray-200 text-gray-500 hover:bg-gray-50"
                      onClick={() => setPickerOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
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
                className="rounded-xl w-8 h-8 p-0 flex items-center justify-center border-none"
                onClick={prevMonth}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                className="rounded-xl w-8 h-8 p-0 flex items-center justify-center border-none"
                onClick={nextMonth}
              >
                ›
              </Button>
            </div>
          <div className="flex items-center gap-2">
          </div>
        </div>

      </div>

      {/* Calendar */}
      <div className="mb-6">
        {/* Day headers */}
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

        {/* Days grid — position:relative so popup is anchored here */}
        <div className="grid grid-cols-7 gap-2 relative" ref={gridRef}>
          {days.map((dayObj, idx) => {
            const key = isoKey(dayObj.year, dayObj.month, dayObj.day);
            const hasEvent = meetingDateKeys.has(key);
            const isToday = key === todayKey;
            const isSelected = selectedKey === key;
            return (
              <>
                <div
                  key={idx}
                  onClick={(e) => handleDayClick(e, dayObj)}
                  className={`aspect-square min-w-[25px] flex flex-col items-center  justify-center rounded-sm md:rounded-xl text-xs font-medium transition-colors
                    ${
                      isSelected
                        ? "bg-[#3088B7] text-white"
                        : isToday
                          ? "border border-[#3088B7] text-[#3088B7]"
                          : dayObj.isCurrentMonth
                            ? "text-gray-700"
                            : "text-gray-300"
                    }
                    ${hasEvent ? "cursor-pointer hover:opacity-80 bg-brand-blue text-white " : "cursor-default bg-black/5"}
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
                {/* Absolute Event Popup — anchored to the clicked cell */}
                {popupEvent && (
                  <div
                    ref={popupRef}
                    className="absolute z-40 w-56 bg-[#1A4B65] rounded-xl p-4 text-white"
                    style={popupStyle}
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-white/20 pb-2">
                      <div className="flex items-center gap-2 ">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium leading-tight">
                          {popupLabel}
                        </span>
                      </div>
                      <button
                        className="text-white/80 hover:text-white text-lg leading-none ml-1 flex-shrink-0"
                        onClick={closePopup}
                      >
                        ×
                      </button>
                    </div>

                    <div className="rounded-xl p-3 mb-3">
                      <p className="text-xs w-fit px-2 py-1 font-medium mb-2 rounded-2xl bg-[#378ADD38] text-[#78B4F5]">
                        {popupEvent.badge}
                      </p>
                      <p className="text-base font-semibold leading-tight">
                        {popupEvent.title}
                      </p>
                      {/* <p className="text-sm font-semibold">
                        {popupEvent.title}
                      </p> */}
                      <p className="text-xs opacity-90 mt-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {popupEvent.time}
                      </p>
                      <p className="text-xs opacity-80 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {popupEvent.location}
                      </p>
                    </div>

                    <div className="bg-[#2C6B8B] rounded-xl px-3 py-2.5 mb-3 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1C4C2B] text-[#9EE2A8] text-xs font-semibold flex items-center justify-center">
                        {getInitials(popupEvent.clientName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-white font-medium truncate">
                          {popupEvent.clientName}
                        </p>
                        <p className="text-[10px] text-white/75 truncate">
                          {popupEvent.projectName}
                        </p>
                      </div>
                    </div>

<a href={APP_ROUTES.CONSULTANT.CALENDAR} className="block bg-white w-full px-2 py-2 text-center text-[#0891B2] rounded-xl text-xs font-semibold hover:bg-gray-100">
                      View Details →
                    </a>
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>

      <div className="my-4 p-2 border border-gray-200 rounded-xl">
        <StatsCards data={data} />
      </div>

      <div>
        <TodaySchedule />
      </div>
    </div>
  );
};
