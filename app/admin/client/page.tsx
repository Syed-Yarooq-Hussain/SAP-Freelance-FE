"use client";

import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import { getAdminClientColumns, adminClientRows, AdminClientRow } from "@/data/adminClient";
import { useMemo, useState } from "react";

export default function AdminClientPage() {
  const [rows, setRows] = useState<AdminClientRow[]>(adminClientRows);

  const columns = useMemo(
    () =>
      getAdminClientColumns((id) =>
        setRows((prev) =>
          prev.map((r) => (r.id === id ? { ...r, locked: !r.locked } : r))
        )
      ),
    []
  );

  return (
    <Sidebar>
      <Consultant title="Clients" columns={columns} rows={rows} />
    </Sidebar>
  );
}
