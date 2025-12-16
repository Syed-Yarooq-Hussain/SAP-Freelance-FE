"use client";

import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import { AdminNotificationRow, adminNotificationRows, getAdminNotificationColumns } from "@/data/adminNotification";
import { useMemo, useState } from "react";

export default function AdminNotificationPage() {
  const [rows, setRows] = useState<AdminNotificationRow[]>(adminNotificationRows);

  const columns = useMemo(
    () =>
      getAdminNotificationColumns((id) =>
        setRows((prev) =>
          prev.map((r) => (r.id === id ? { ...r,} : r))
        )
      ),
    []
  );

  return (
    <Sidebar>
      <Consultant title="Notifications" columns={columns} rows={rows} />
    </Sidebar>
  );
}
