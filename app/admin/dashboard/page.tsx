// AdminDashboardPage.tsx
"use client";

import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import {
  adminStats,
  adminConsultantColumns,
  adminConsultantRows,
} from "@/data/adminDashboard";
import AppButton from "@/components/Button";

export default function AdminDashboardPage() {
  return (
    <Sidebar>
      <Dashboard
        stats={adminStats}
        projectTable={{
          title: "Consultant Account Request",
          columns: adminConsultantColumns,
          rows: adminConsultantRows,
          pageSize: 10,
          showAvatar: true,
          avatarField: "avatar",
          enableSelection: true,
          // NEW: inline accept/reject beside selected count
          selectionActions: (
            <>
              <AppButton label="Accept" colorKey="BLUE" width={180} />
              <AppButton label="Reject" colorKey="RED" width={180} />
            </>
          ),
        }}
      />
    </Sidebar>
  );
}
