"use client";

import Sidebar from "@/components/Sidebar";
import Payment from "@/components/specific/Payment";
import {
  consultantPaymentColumns,
  consultantPaymentRows,
} from "@/data/consultantPayment";

export default function ConsultantPaymentPage() {
  return (
    <Sidebar>
      <Payment
        title="Payment"
        columns={consultantPaymentColumns}
        rows={consultantPaymentRows}
      />
    </Sidebar>
  );
}
