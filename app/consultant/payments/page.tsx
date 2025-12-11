"use client";

import { useConsultantPayments } from "@/actions/payments/useConsultantPayments";
import Sidebar from "@/components/Sidebar";
import Payment from "@/components/specific/Payment";
import { consultantPaymentColumns } from "@/data/consultantPayment";
import type {
  ConsultantPaymentRow,
  IConsultantPaymentDTO,
} from "@/types/consultant";
import { formatYMD } from "@/utils/dateTime";
import { useCallback, useEffect, useState } from "react";

export default function ConsultantPaymentPage() {
  const [consultantPaymentRows, setPaymentRows] = useState<
    ConsultantPaymentRow[]
  >([]);
  const { mutate: loadPayments } = useConsultantPayments();

  const fetchPayments = useCallback(() => {
    loadPayments(undefined, {
      onSuccess: (res) => {
        const mapped: ConsultantPaymentRow[] =
          res.data?.map((item: IConsultantPaymentDTO) => ({
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
        columns={consultantPaymentColumns}
        rows={consultantPaymentRows}
      />
    </Sidebar>
  );
}
