"use client";

import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminPaymentsPanel from "@/components/admin/AdminPaymentsPanel";
import Sidebar from "@/components/Sidebar";

export default function AdminPaymentPage() {
  return (
    <Sidebar>
      <AdminPageShell
        title="Payments"
        description="Review client and consultant payment records."
      >
        <AdminPaymentsPanel />
      </AdminPageShell>
    </Sidebar>
  );
}
