"use client";
import { useAdminDashboardStats } from "@/actions/admin/useAdminDashboardStats";
import AppButton from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import VisibilityChart from "@/components/VisibilityChart";
import {
  adminConsultantColumns,
  adminConsultantRows,
} from "@/data/adminDashboard";

export default function AdminDashboardPage() {
  const stats = useAdminDashboardStats();

  return (
    <Sidebar>
      <Dashboard
        stats={stats}
        chart={<VisibilityChart />}
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
