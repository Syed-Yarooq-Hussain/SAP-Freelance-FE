"use client";

import { CalendarEvent } from "@/components/MonthlyCalendar";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import EngagementCalendarCard from "@/components/EngagementCalendarCard";
import {
  consultantAnnouncements,
  consultantSidebar,
  consultantStats,
  interviewColumns,
  interviewRows,
  taskColumns,
  taskRows,
} from "@/data/consultantDashboard";

export default function ConsultantDashboardPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const events: CalendarEvent[] = [
    {
      date: `${year}-${String(month + 1).padStart(2, "0")}-02`,
      type: "project",
    },
    {
      date: `${year}-${String(month + 1).padStart(2, "0")}-07`,
      type: "interview",
    },
    {
      date: `${year}-${String(month + 1).padStart(2, "0")}-11`,
      type: "project",
    },
    {
      date: `${year}-${String(month + 1).padStart(2, "0")}-18`,
      type: "project",
    },
    {
      date: `${year}-${String(month + 1).padStart(2, "0")}-23`,
      type: "interview",
    },
  ];

  return (
    <Sidebar>
      <Dashboard
        announcements={consultantAnnouncements}
        stats={consultantStats}
        chart={
          <EngagementCalendarCard events={events} year={year} month={month} />
        }
        projectTable={{
          title: "Project Pipeline",
          columns: interviewColumns,
          rows: interviewRows,
          showViewMore: true,
        }}
        financeTable={{
          title: "Financial List",
          columns: taskColumns,
          rows: taskRows,
          showViewMore: true,
        }}
        sidebarSections={consultantSidebar}
      />
    </Sidebar>
  );
}
