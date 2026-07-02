"use client";

import { useConsultantCalendar } from "@/actions/consultants/useConsultantCalendar";
import type { ApiDay } from "@/types/calendar";
import { toAmPm } from "@/utils/dateTime";
import { useCallback, useMemo, useState } from "react";
import {
  DashboardCalendar,
  type DashboardCalendarDateClickPayload,
  type DashboardCalendarEvent,
  type DashboardCalendarMonthPayload,
} from "../consultant-dashboard-new/dashboard-calendar";
import { useCalendar } from "./CalendarContext";

type CalendarFilter = "all" | "client" | "interviews";

function getDayAvailability(day: ApiDay): {
  available: boolean;
  slots: { start_time: string; end_time: string }[];
} {
  const fallback = day as unknown as {
    availability?: {
      available?: boolean;
      slots?: { start_time: string; end_time: string }[];
    };
  };
  const slots = Array.isArray(day.slots)
    ? day.slots
    : fallback.availability?.slots ?? [];

  return {
    available: Boolean(day.active || fallback.availability?.available),
    slots,
  };
}

function mapScheduleToDashboardEvents(
  days: ApiDay[] | undefined,
  filter: CalendarFilter,
): DashboardCalendarEvent[] {
  if (!days?.length) return [];
  const out: DashboardCalendarEvent[] = [];
  for (const day of days) {
    const availability = getDayAvailability(day);
    if (filter === "all" && availability.available && availability.slots.length > 0) {
      const firstSlot = availability.slots[0];
      const lastSlot = availability.slots[availability.slots.length - 1];
      out.push({
        date: day.date,
        dateTime: `${day.date}T${(firstSlot.start_time ?? "09:00").slice(0, 5)}:00`,
        title: "Available",
        time: `${toAmPm(firstSlot.start_time)} - ${toAmPm(lastSlot.end_time)}`,
        location: "Availability",
        badge: "Available",
        clientName: "Availability",
        projectName: "Working hours",
        kind: "availability",
      });
    }

    for (const e of day.events ?? []) {
      if (filter === "interviews" && e.type !== "INTERVIEW") continue;
      if (filter === "client" && e.type === "INTERVIEW") continue;

      const rawStart = e.start_time ?? "09:00";
      const rawEnd = e.end_time ?? rawStart;
      const startNorm = rawStart.slice(0, 5);
      const dateKey = day.date;
      const isInterview = e.type === "INTERVIEW";
      out.push({
        date: dateKey,
        dateTime: e.all_day
          ? `${dateKey}T12:00:00`
          : `${dateKey}T${startNorm}:00`,
        title:
          e.title?.trim() ||
          (isInterview ? "Interview" : "Meeting"),
        time: e.all_day
          ? "All day"
          : `${toAmPm(rawStart)} – ${toAmPm(rawEnd)}`,
        location:
          typeof e.meeting_link === "string" && e.meeting_link.trim()
            ? e.meeting_link
            : "Online",
        badge: isInterview ? "Interview" : "Client meeting",
        clientName: "—",
        projectName: "—",
        kind: "event",
      });
    }
  }
  return out;
}

export default function CalendarEvents({
  filter,
}: {
  filter: CalendarFilter;
}) {
  const now = new Date();
  const [cursor, setCursor] = useState(() => ({
    year: now.getFullYear(),
    month: now.getMonth(),
  }));

  const { calendarRef, setActiveView } = useCalendar();

  const { data, isLoading } = useConsultantCalendar(cursor.month, cursor.year);

  const events = useMemo(
    () => mapScheduleToDashboardEvents(data?.days, filter),
    [data?.days, filter],
  );

  const handleMonthChange = useCallback(
    (p: DashboardCalendarMonthPayload) => {
      setCursor({ year: p.year, month: p.month });
      calendarRef.current?.getApi().gotoDate(new Date(p.year, p.month, 1));
    },
    [calendarRef],
  );

  const handleDateClick = useCallback(
    (p: DashboardCalendarDateClickPayload) => {
      const d = new Date(p.year, p.month, p.day, 12, 0, 0, 0);
      calendarRef.current?.getApi().changeView("timeGridDay", d);
      setActiveView("timeGridDay");
    },
    [calendarRef, setActiveView],
  );

  return (
    <div className="relative">
      {isLoading ? (
        <div className="absolute inset-0 z-[1] flex items-center justify-center rounded-lg bg-white/70 text-xs text-slate-500">
          Loading…
        </div>
      ) : null}
      <DashboardCalendar
        events={events}
        showSmallHeader
        onMonthChange={handleMonthChange}
        onDateClick={handleDateClick}
      />
    </div>
  );
}
