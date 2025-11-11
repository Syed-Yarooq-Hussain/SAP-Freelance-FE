"use client";

import { CalendarEvent } from "@/components/MonthlyCalendar";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import EngagementCalendarCard from "@/components/EngagementCalendarCard";
import {
  clientAnnouncements,
  clientInterviewColumns,
  clientInterviewRows,
  clientStats,
  clientTaskColumns,
  clientTaskRows,
  getClientSidebar,
} from "@/data/clientDashboard";
import { useRouter } from "next/navigation";

export default function ClientDashboardPage() {
  const router = useRouter();
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
        announcements={clientAnnouncements}
        stats={clientStats}
        chart={
          <EngagementCalendarCard events={events} year={year} month={month} />
        }
        projectTable={{
          title: "Project Highlights",
          columns: clientInterviewColumns,
          rows: clientInterviewRows,
          showViewMore: true,
        }}
        financeTable={{
          title: "Payment Pending",
          columns: clientTaskColumns,
          rows: clientTaskRows,
          showViewMore: true,
        }}
        sidebarSections={getClientSidebar(router)}
      />
    </Sidebar>
  );
}
