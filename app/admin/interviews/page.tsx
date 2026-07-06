"use client";

import AdminPageShell from "@/components/admin/AdminPageShell";
import Sidebar from "@/components/Sidebar";
import Interview from "@/components/specific/Interview";
import {
  adminInterviewColumns,
  adminInterviewRows,
} from "@/data/adminInterview";

export default function AdminInterviewPage() {
  return (
    <Sidebar>
      <AdminPageShell
        title="Meetings"
        description="View scheduled interviews and meeting activity."
      >
        <Interview
          title="List of Meetings"
          stats={[]}
          columns={adminInterviewColumns}
          rows={adminInterviewRows}
        />
      </AdminPageShell>
    </Sidebar>
  );
}
