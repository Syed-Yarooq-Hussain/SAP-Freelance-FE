"use client";

import { useAdminConsultants } from "@/actions/admin/useAdminConsultants";
import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import { getAdminConsultantColumns } from "@/data/adminConsultant";
import { useMemo, useState } from "react";

type TabKey = "active" | "pending" | "locked";

import { useUpdateConsultantStatus } from "@/actions/admin/useUpdateConsultantStatus";

function asRecord(value: unknown): Record<string, any> {
  return value && typeof value === "object" ? (value as Record<string, any>) : {};
}

function formatModuleValue(value: unknown): string {
  if (Array.isArray(value)) {
    const labels = value
      .map((item) => {
        const record = asRecord(item);
        return (
          record.name ??
          record.module?.name ??
          record.module_name ??
          record.title ??
          item
        );
      })
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    return labels.length > 0 ? labels.join(", ") : "N/A";
  }

  if (typeof value === "string" && value.trim()) return value;
  if (value != null && value !== "") return String(value);

  return "N/A";
}

function getConsultantModules(item: Record<string, any>) {
  const modules = asRecord(item.modules);

  if (modules.core || modules.others) {
    return {
      coremodules: formatModuleValue(modules.core),
      othersmodules: formatModuleValue(modules.others),
    };
  }

  const userModules = Array.isArray(item.user?.modules) ? item.user.modules : [];
  const coreModules = userModules.filter((module: any) => module?.is_primary);
  const otherModules = userModules.filter((module: any) => !module?.is_primary);

  return {
    coremodules: formatModuleValue(item.core_module ?? coreModules),
    othersmodules: formatModuleValue(item.other_module ?? otherModules),
  };
}

function formatYears(value: unknown): string {
  if (value === null || value === undefined || value === "") return "N/A";
  return `${value} Years`;
}

function formatRate(value: unknown): string {
  if (value === null || value === undefined || value === "") return "N/A";
  return `$${value}/hour`;
}

export default function AdminConsultantPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const { data } = useAdminConsultants(activeTab);
  const updateStatus = useUpdateConsultantStatus();

  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((rawItem, index) => {
      const item = asRecord(rawItem);
      const consultant = asRecord(item.consultants ?? item.consultant);
      const user = asRecord(item.user);
      const modules = getConsultantModules(item);
      const id = Number(item.id ?? consultant.id ?? user.id ?? index);

      return {
        id,
        avatar: user.avatar ?? item.avatar ?? `/img/u${((index % 5) + 1).toString()}.png`,
        name: item.name ?? item.username ?? user.username ?? "N/A",
        ...modules,
        experience: formatYears(item.experience ?? consultant.experience),
        hourlyRate: formatRate(item.rate ?? consultant.rate),
        locked: (item.status ?? user.status) === "locked",
      };
    });
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
    [updateStatus]
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
