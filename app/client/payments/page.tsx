"use client";

import { useClientPayments } from "@/actions/payments/useClientPayments";
import Sidebar from "@/components/Sidebar";
import Payment from "@/components/specific/Payment";
import { clientPaymentColumns } from "@/data/clientPayment";
import type { ClientPaymentRow, IClientPaymentDTO } from "@/types/client";
import { formatYMD } from "@/utils/dateTime";
import { useCallback, useEffect, useState } from "react";

export default function ClientPaymentPage() {
  const [paymentRows, setPaymentRows] = useState<ClientPaymentRow[]>([]);
  const { mutate: loadPayments } = useClientPayments();

  const fetchPayments = useCallback(() => {
    loadPayments(undefined, {
      onSuccess: (res) => {
        const mapped: ClientPaymentRow[] =
          res.data?.map((item: IClientPaymentDTO) => ({
            id: item.id,
            project: item.project?.name ?? "N/A",
            duedates: formatYMD(item.due_date),
            amount: `$${item.amount}`,
            status: item.payment_module ?? "Pending",
            invoice: "-",
          })) ?? [];

        setPaymentRows(mapped);
      },
      onError: (err) => console.error(err),
    });
  }, [loadPayments]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <Sidebar>
      <Payment
        title="Payment"
        columns={clientPaymentColumns}
        rows={paymentRows}
      />
    </Sidebar>
  );
}
