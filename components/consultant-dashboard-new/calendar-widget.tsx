"use client";

import React, { useMemo } from "react";
import { StatsCards } from "./stats-card";
import { TodaySchedule } from "./today-schedule";
import { DashboardData } from "@/types/dashboard";
import { useConsultantMeetings } from "@/actions/consultants/useConsultantMeetings";
import { APP_ROUTES } from "@/utils/app_routes";
import {
  DashboardCalendar,
  type DashboardCalendarEvent,
} from "./dashboard-calendar";

interface ConsultantMeeting {
  date_time?: string;
  event_type?: string;
  duration?: number;
  project_name?: string;
  sender_name?: string;
  invitees_names?: string;
}

function toTitleCase(value?: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function firstNonEmpty(...values: Array<string | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function meetingToCalendarEvent(
  meeting: ConsultantMeeting,
): DashboardCalendarEvent | null {
  if (typeof meeting?.date_time !== "string") return null;
  const key = meeting.date_time.split("T")[0];
  if (!key) return null;

  const startDate = new Date(meeting.date_time);
  const endDate = new Date(
    startDate.getTime() + (Number(meeting.duration) || 0) * 60 * 1000,
  );
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const title = firstNonEmpty(meeting.event_type) || "Meeting";
  const clientName =
    firstNonEmpty(meeting.sender_name, meeting.invitees_names) ||
    "Unknown client";
  const location =
    firstNonEmpty(
      meeting.project_name,
      meeting.sender_name,
      meeting.invitees_names,
    ) || "Online";
  const meetingType = toTitleCase(meeting.event_type) || "Meeting";

  return {
    date: key,
    dateTime: meeting.date_time,
    title,
    time: `${startTime}`,
    location,
    badge: `${meetingType} Scheduled`,
    clientName,
    projectName: firstNonEmpty(meeting.project_name) || "No project",
  };
}

export const CalendarWidget: React.FC<{ data: DashboardData }> = ({ data }) => {
  const { data: meetings } = useConsultantMeetings();

  const meetingList: ConsultantMeeting[] = useMemo(() => {
    return Array.isArray(meetings?.data) ? meetings.data : [];
  }, [meetings]);

  const calendarEvents = useMemo(() => {
    const out: DashboardCalendarEvent[] = [];
    meetingList.forEach((m) => {
      const ev = meetingToCalendarEvent(m);
      if (ev) out.push(ev);
    });
    return out;
  }, [meetingList]);

  return (
    <div className="rounded-xl md:p-2 p-0">
      <DashboardCalendar
        events={calendarEvents}
        viewDetailsHref={APP_ROUTES.CONSULTANT.CALENDAR}
      />

      <div className="my-2 border-none md:border border-gray-200 md:bg-none bg-white md:rounded-none rounded-box-xl md:p-0 p-3">
        <StatsCards data={data} />
      </div>

      <div>
        <TodaySchedule />
      </div>
    </div>
  );
};
