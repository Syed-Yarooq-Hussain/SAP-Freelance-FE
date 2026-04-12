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

function mapScheduleToDashboardEvents(
  days: ApiDay[] | undefined,
): DashboardCalendarEvent[] {
  if (!days?.length) return [];
  const out: DashboardCalendarEvent[] = [];
  for (const day of days) {
    for (const e of day.events ?? []) {
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
      });
    }
  }
  return out;
}

export default function CalendarEvents() {
  const now = new Date();
  const [cursor, setCursor] = useState(() => ({
    year: now.getFullYear(),
    month: now.getMonth(),
  }));

  const { calendarRef, setActiveView } = useCalendar();

  const { data, isLoading } = useConsultantCalendar(cursor.month, cursor.year);

  const events = useMemo(
    () => mapScheduleToDashboardEvents(data?.days),
    [data?.days],
  );

  const handleMonthChange = useCallback((p: DashboardCalendarMonthPayload) => {
    setCursor({ year: p.year, month: p.month });
  }, []);

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
