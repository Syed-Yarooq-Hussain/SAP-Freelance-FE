"use client";

import { useAdminClients } from "@/actions/admin/useAdminClients";
import { useUpdateClientStatus } from "@/actions/admin/useUpdateClientStatus";
import AdminPageShell from "@/components/admin/AdminPageShell";
import CreateClientDialog from "@/components/admin/CreateClientDialog";
import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import { getAdminClientColumns } from "@/data/adminClient";
import { AdminClientRow } from "@/types/admin";
import { useMemo, useState } from "react";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { Button } from "@mui/material";

type TabKey = "active" | "pending" | "locked";

const CLIENT_STATUS_MAP: Record<TabKey, "active" | "rejected" | "locked"> = {
  active: "active",
  pending: "rejected",
  locked: "locked",
};

export default function AdminClientPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const apiStatus = CLIENT_STATUS_MAP[activeTab];
  const { data } = useAdminClients(apiStatus);
  const updateClientStatus = useUpdateClientStatus();

  const rows: AdminClientRow[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      id: item.id,
      avatar: "",
      name: item.username ?? item.email?.split("@")[0] ?? "Unnamed client",
      email: item.email ?? item.user?.email ?? "N/A",
      phone: item.phone ?? item.user?.phone ?? "N/A",
      activeprojects: item.active_count ?? 0,
      completedprojects: item.completed_count ?? 0,
      draftprojects: item.draft_count ?? 0,
      profitMarginPercentage: Number(item.profit_margin_percentage ?? 0),
      locked: item.status === "locked",
    }));
  }, [data]);

  const columns = useMemo(
    () =>
      getAdminClientColumns((id, isLocked) => {
        if (activeTab === "locked" || isLocked) return;
        updateClientStatus.mutate({
          clientId: id,
          status: "locked",
        });
      }),
    [activeTab]
  );

  return (
    <Sidebar>
      <AdminPageShell
        title="Clients"
        description="Review client accounts, project activity, and account status."
        actions={
          <Button
            variant="contained"
            startIcon={<PersonAddAltRoundedIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Client
          </Button>
        }
      >
        <Consultant
          key={activeTab}
          title="Clients"
          columns={columns}
          rows={rows}
          showTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          autoRowHeight
        />
        <CreateClientDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
      </AdminPageShell>
    </Sidebar>
  );
}
