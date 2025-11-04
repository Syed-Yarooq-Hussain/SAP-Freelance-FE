"use client";

import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
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
  return (
    <Sidebar>
      <Dashboard
        announcements={consultantAnnouncements}
        stats={consultantStats}
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
