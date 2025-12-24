"use client";

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
      <Notification title="Notifications" rows={rows} columns={columns} />
    </Sidebar>
  );
}
