"use client";

import { useConsultantPayments } from "@/actions/payments/useConsultantPayments";
import Sidebar from "@/components/Sidebar";
import Payment from "@/components/specific/Payment";
import { consultantPaymentColumns } from "@/data/consultantPayment";
import { useToast } from "@/providers/ToastProvider";
import type {
  ConsultantPaymentRow,
  IConsultantPaymentDTO,
} from "@/types/consultant";
import { formatCurrency } from "@/utils/payments";
import { useCallback, useEffect, useState } from "react";

export default function ConsultantPaymentPage() {
  const [consultantPaymentRows, setPaymentRows] = useState<
    ConsultantPaymentRow[]
  >([]);
  const { mutate: loadPayments } = useConsultantPayments();
  const { toast } = useToast();

  const getPdfUrl = (item: IConsultantPaymentDTO) => {
    return (
      item.bills?.find((bill) => bill.pdf_url)?.pdf_url ||
      item.pdf_url ||
      item.pdfUrl ||
      item.invoice_url ||
      item.bill_pdf_url ||
      item.document?.url ||
      ""
    );
  };

  const fetchPayments = useCallback(() => {
    loadPayments(undefined, {
      onSuccess: (res) => {
        const mapped: ConsultantPaymentRow[] =
          res.data?.map((item: IConsultantPaymentDTO) => ({
            id: item.id || `${item.project?.id ?? "project"}-${item.month}`,
            project: item.project?.name || item.project_name || "N/A",
            duedates: item.month || "N/A",
            totalHours: `${item.total_hours ?? 0}`,
            amount: formatCurrency(item.total_amount ?? 0),
            status: item.is_paid ? "Paid" : item.status || "Pending",
            pdfUrl: getPdfUrl(item),
          })) ?? [];

        setPaymentRows(mapped);
      },
      onError: (err) => {
        toast(err.message || "Failed to load monthly bills", "error");
      },
    });
  }, [loadPayments, toast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <Sidebar>
      <Payment
        title="Payments"
        columns={consultantPaymentColumns}
        rows={consultantPaymentRows}
      />
    </Sidebar>
  );
}
