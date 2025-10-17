"use client";

import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import {
  clientAnnouncements,
  clientInterviewColumns,
  clientInterviewRows,
  clientSidebar,
  clientStats,
  clientTaskColumns,
  clientTaskRows,
} from "@/data/clientDashboard";

export default function ClientDashboardPage() {
  return (
    <Sidebar>
    <Dashboard
      announcements={clientAnnouncements}
      stats={clientStats}
      projectTable={{
        title: "Project Highlights",
        columns: clientInterviewColumns,
        rows: clientInterviewRows,
      }}
      financeTable={{
        title: "Payment Pending",
        columns: clientTaskColumns,
        rows: clientTaskRows,
      }}
      sidebarSections={clientSidebar}
    />
    </Sidebar>
  );
}
