"use client";
import { useAdminDashboardStats } from "@/actions/admin/useAdminDashboardStats";
import { usePendingConsultants } from "@/actions/admin/usePendingConsultants";
import AppButton from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import VisibilityChart from "@/components/VisibilityChart";
import { adminConsultantColumns } from "@/data/adminDashboard";

export default function AdminDashboardPage() {
  const stats = useAdminDashboardStats();
  const { data } = usePendingConsultants();

  const rows =
    data?.data?.map((consultant, index) => ({
      id: `pending-consultant-${consultant.id}-${index}`,
      name: consultant.username,
      coremodules: consultant.modules?.core || "N/A",
      othersmodules: consultant.modules?.others || "N/A",
      experience: `${consultant.experience} Years`,
      hourlyRate: `${consultant.rate}/hour`,
    })) ?? [];

  return (
    <Sidebar>
      <Dashboard
        stats={stats}
        chart={<VisibilityChart />}
        projectTable={{
          title: "Consultant Account Request",
          columns: adminConsultantColumns,
          rows,
          pageSize: 10,
          showAvatar: true,
          avatarField: "name",
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
