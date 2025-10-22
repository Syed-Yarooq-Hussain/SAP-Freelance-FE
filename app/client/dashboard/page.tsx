"use client";

import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
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
        sidebarSections={getClientSidebar(router)}
      />
    </Sidebar>
  );
}
