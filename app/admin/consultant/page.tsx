"use client";

import AdminConsultantDirectory from "@/components/admin/AdminConsultantDirectory";
import AdminPageShell from "@/components/admin/AdminPageShell";
import Sidebar from "@/components/Sidebar";

export default function AdminConsultantPage() {
  return (
    <Sidebar>
      <AdminPageShell
        title="Consultants"
        description="Browse the consultant directory with Team Builder filters."
      >
        <AdminConsultantDirectory />
      </AdminPageShell>
    </Sidebar>
  );
}
