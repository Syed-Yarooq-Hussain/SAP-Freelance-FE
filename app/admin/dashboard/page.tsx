"use client";

import { useAdminDashboardStats } from "@/actions/admin/useAdminDashboardStats";
import { usePendingConsultants } from "@/actions/admin/usePendingConsultants";
import { useUpdateConsultantStatus } from "@/actions/admin/useUpdateConsultantStatus";
import AppButton from "@/components/Button";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/specific/Dashboard";
import VisibilityChart from "@/components/VisibilityChart";
import { adminConsultantColumns } from "@/data/adminDashboard";
import { GridRowId } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function AdminDashboardPage() {
  const stats = useAdminDashboardStats();
  const { data } = usePendingConsultants();
  const { mutateAsync } = useUpdateConsultantStatus();
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = React.useState<GridRowId[]>([]);

  const rows =
    data?.data?.map((consultant) => ({
      id: consultant.id,
      consultantId: consultant.id,
      name: consultant.username,
      coremodules: consultant.modules?.core || "N/A",
      othersmodules: consultant.modules?.others || "N/A",
      experience: `${consultant.experience} Years`,
      hourlyRate: `${consultant.rate}/hour`,
    })) ?? [];

  const handleBulkAccept = async () => {
    if (!selectedIds.length) return;

    await Promise.all(
      selectedIds.map((id) =>
        mutateAsync({ consultantId: Number(id), status: "active" })
      )
    );

    setSelectedIds([]);
    queryClient.invalidateQueries({ queryKey: ["pending-consultants"] });
  };

  const handleBulkReject = async () => {
    if (!selectedIds.length) return;

    await Promise.all(
      selectedIds.map((id) =>
        mutateAsync({ consultantId: Number(id), status: "rejected" })
      )
    );

    setSelectedIds([]);
    queryClient.invalidateQueries({ queryKey: ["pending-consultants"] });
  };

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
          onSelectionChange: setSelectedIds,
          selectionActions: (
            <>
              <AppButton
                label="Accept"
                colorKey="BLUE"
                width={180}
                disabled={!selectedIds.length}
                onClick={handleBulkAccept}
              />
              <AppButton
                label="Reject"
                colorKey="RED"
                width={180}
                disabled={!selectedIds.length}
                onClick={handleBulkReject}
              />
            </>
          ),
        }}
      />
    </Sidebar>
  );
}
