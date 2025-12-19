"use client";

import { useAdminConsultants } from "@/actions/admin/useAdminConsultants";
import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import { getAdminConsultantColumns } from "@/data/adminConsultant";
import { AdminConsultantRow } from "@/types/admin";
import { useMemo, useState } from "react";

type TabKey = "active" | "pending" | "locked";

export default function AdminConsultantPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const { data, isLoading } = useAdminConsultants(activeTab);
  const mapAdminConsultantRow = (item: any): AdminConsultantRow => ({
    id: item.id,
    avatar: "",
    name: item.username,
    coremodules: item.modules?.core || "N/A",
    othersmodules: item.modules?.others || "N/A",
    experience: `${item.experience ?? "-"} Years`,
    hourlyRate: `$${item.rate}/hour`,
    locked: item.status === "locked",
  });

  const rows: AdminConsultantRow[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(mapAdminConsultantRow);
  }, [data]);

  const columns = useMemo(
    () =>
      getAdminConsultantColumns((id) => {
        console.log("Toggle lock", id);
      }),
    []
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
