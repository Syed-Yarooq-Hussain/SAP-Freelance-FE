"use client";

import { useAdminConsultants } from "@/actions/admin/useAdminConsultants";
import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import { getAdminConsultantColumns } from "@/data/adminConsultant";
import { useMemo, useState } from "react";

type TabKey = "active" | "pending" | "locked";

import { useUpdateConsultantStatus } from "@/actions/admin/useUpdateConsultantStatus";

export default function AdminConsultantPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const { data } = useAdminConsultants(activeTab);
  const updateStatus = useUpdateConsultantStatus();

  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      id: item.id,
      avatar: "",
      name: item.username,
      coremodules: item.modules?.core || "N/A",
      othersmodules: item.modules?.others || "N/A",
      experience: `${item.experience ?? "-"} Years`,
      hourlyRate: `$${item.rate}/hour`,
      locked: item.status === "locked",
    }));
  }, [data]);

  const columns = useMemo(
    () =>
      getAdminConsultantColumns((id, isLocked) => {
        if (isLocked) return;

        updateStatus.mutate({
          consultantId: id,
          status: "locked",
        });
      }),
    [activeTab]
  );

  return (
    <Sidebar>
      <Consultant
        key={activeTab}
        title="Consultant"
        columns={columns}
        rows={rows}
        showTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </Sidebar>
  );
}
