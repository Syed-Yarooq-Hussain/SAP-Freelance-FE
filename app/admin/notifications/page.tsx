"use client";

import AdminPageShell from "@/components/admin/AdminPageShell";
import Sidebar from "@/components/Sidebar";
import Notification from "@/components/specific/Notification";
import {
  AdminNotificationRow,
  adminNotificationRows,
  getAdminNotificationColumns,
} from "@/data/adminNotification";
import { useMemo, useState } from "react";

export default function AdminNotificationPage() {
  const [rows, setRows] = useState<AdminNotificationRow[]>(
    adminNotificationRows
  );

  const columns = useMemo(
    () =>
      getAdminNotificationColumns((id) =>
        setRows((prev) =>
          prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
        )
      ),
    []
  );

  return (
    <Sidebar>
      <AdminPageShell
        title="Notifications"
        description="Manage platform notification templates and delivery state."
      >
        <Notification title="Notifications" rows={rows} columns={columns} />
      </AdminPageShell>
    </Sidebar>
  );
}
