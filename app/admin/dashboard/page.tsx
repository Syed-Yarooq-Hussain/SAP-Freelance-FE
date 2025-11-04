"use client";

import AppButton from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import {
  adminConsultantColumns,
  adminConsultantRows,
  adminStats,
} from "@/data/adminDashboard";

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
