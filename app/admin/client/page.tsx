"use client";

import { useAdminClients } from "@/actions/admin/useAdminClients";
import { useUpdateClientStatus } from "@/actions/admin/useUpdateClientStatus";
import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import { getAdminClientColumns } from "@/data/adminClient";
import { AdminClientRow } from "@/types/admin";
import { useMemo, useState } from "react";

type TabKey = "active" | "pending" | "locked";

const CLIENT_STATUS_MAP: Record<TabKey, "active" | "rejected" | "locked"> = {
  active: "active",
  pending: "rejected",
  locked: "locked",
};

export default function AdminClientPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");

  const apiStatus = CLIENT_STATUS_MAP[activeTab];
  const { data } = useAdminClients(apiStatus);
  const updateClientStatus = useUpdateClientStatus();

  const rows: AdminClientRow[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      id: item.id,
      avatar: "",
      name: item.username,
      activeprojects: item.active_count ?? 0,
      completedprojects: item.completed_count ?? 0,
      draftprojects: item.draft_count ?? 0,
      locked: item.status === "locked",
    }));
  }, [data]);

  const columns = useMemo(
    () =>
      getAdminClientColumns((id, isLocked) => {
        // 🚫 Locked tab = no action
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
      <Consultant
        key={activeTab}
        title="Clients"
        columns={columns}
        rows={rows}
        showTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </Sidebar>
  );
}
