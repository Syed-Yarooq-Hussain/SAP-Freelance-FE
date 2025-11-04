"use client";

import Sidebar from "@/components/Sidebar";
import Payment from "@/components/specific/Payment";
import { adminPaymentColumns, adminPaymentRows } from "@/data/adminPayment";

export default function AdminPaymentPage() {
  return (
    <Sidebar>
      <Payment
        title="Payment"
        columns={adminPaymentColumns}
        rows={adminPaymentRows}
        showTabs
      />
    </Sidebar>
  );
}
