"use client";

import AdminConsultantPaymentsPanel from "@/components/admin/AdminConsultantPaymentsPanel";
import AdminPageShell from "@/components/admin/AdminPageShell";
import Sidebar from "@/components/Sidebar";

export default function AdminConsultantPaymentsPage() {
  return (
    <Sidebar>
      <AdminPageShell
        title="Consultant Payments"
        description="Review consultant payouts and update their payment status."
      >
        <AdminConsultantPaymentsPanel />
      </AdminPageShell>
    </Sidebar>
  );
}
