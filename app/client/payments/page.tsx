"use client";

import Sidebar from "@/components/Sidebar";
import Payment from "@/components/specific/Payment";
import { clientPaymentColumns, clientPaymentRows } from "@/data/clientPayment";

export default function ClientPaymentPage() {
  return (
    <Sidebar>
      <Payment
        title="Payment"
        columns={clientPaymentColumns}
        rows={clientPaymentRows}
      />
    </Sidebar>
  );
}
