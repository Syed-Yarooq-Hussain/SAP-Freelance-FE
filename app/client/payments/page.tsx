"use client";

import { useUploadDocument } from "@/actions/documents/useUploadDocument";
import { useClientPayments } from "@/actions/payments/useClientPayments";
import { useUpdatePaymentStatus } from "@/actions/payments/useUpdatePaymentStatus";
import DynamicPopup from "@/components/Popup";
import Sidebar from "@/components/Sidebar";
import Payment from "@/components/specific/Payment";
import { createClientPaymentColumns } from "@/data/clientPayment";
import { useToast } from "@/providers/ToastProvider";
import type { ClientPaymentRow, IClientPaymentDTO } from "@/types/client";
import { formatYMD } from "@/utils/dateTime";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ClientPaymentPage() {
  const [paymentRows, setPaymentRows] = useState<ClientPaymentRow[]>([]);
  const [selectedPayment, setSelectedPayment] =
    useState<ClientPaymentRow | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const { mutate: loadPayments } = useClientPayments();
  const { mutate: uploadDocument, isPending: isUploadingDocument } =
    useUploadDocument();
  const { mutate: updatePaymentStatus, isPending: isUpdatingPayment } =
    useUpdatePaymentStatus();
  const { toast } = useToast();

  const fetchPayments = useCallback(() => {
    loadPayments(undefined, {
      onSuccess: (res) => {
        const mapped: ClientPaymentRow[] =
          res.data?.map((item: IClientPaymentDTO) => ({
            id: item.id,
            project: item.project?.name ?? "N/A",
            duedates: formatYMD(item.due_date),
            amount: `$${item.amount}`,
            status: item.is_paid ? "Paid" : "Unpaid",
            receiptUrl: item.document?.url ?? "",
            is_paid: Boolean(item.is_paid),
            payment_module: item.payment_module,
          })) ?? [];

        setPaymentRows(mapped);
      },
      onError: (err) => {
        toast(err.message || "Failed to load payments", "error");
      },
    });
  }, [loadPayments, toast]);

  const handleMarkPaid = useCallback(
    (row: ClientPaymentRow) => {
      if (row.is_paid) return;

      setSelectedPayment(row);
      setSelectedFile(null);
      setUploadPopupOpen(true);
    },
    []
  );

  const handleCloseUploadPopup = () => {
    setUploadPopupOpen(false);
    setSelectedPayment(null);
    setSelectedFile(null);
  };

  const handleUploadSubmit = () => {
    if (!selectedPayment) return;

    if (!selectedFile) {
      toast("Please upload receipt first", "warning");
      return;
    }

    uploadDocument(
      { file: selectedFile, type: "client_payment" },
      {
        onSuccess: (uploadRes) => {
          const docId = uploadRes.data?.id;
          const receiptUrl = uploadRes.data?.url ?? "";

          if (!docId) {
            toast("Failed to get document ID from upload", "error");
            return;
          }

          updatePaymentStatus(
            {
              paymentId: selectedPayment.id,
              payload: {
                is_paid: true,
                doc_id: docId,
                payment_module: selectedPayment.payment_module,
              },
            },
            {
              onSuccess: () => {
                toast("Payment marked as paid and receipt uploaded", "success");
                setPaymentRows((prev) =>
                  prev.map((payment) =>
                    payment.id === selectedPayment.id
                      ? {
                          ...payment,
                          is_paid: true,
                          status: "Paid",
                          receiptUrl,
                        }
                      : payment
                  )
                );
                handleCloseUploadPopup();
              },
              onError: (err) => {
                toast(
                  err.message || "Failed to mark payment as paid",
                  "error"
                );
              },
            }
          );
        },
        onError: (err) => {
          toast(err.message || "Failed to upload receipt", "error");
        },
      }
    );
  };

  const columns = useMemo(
    () => createClientPaymentColumns(handleMarkPaid, isUpdatingPayment),
    [handleMarkPaid, isUpdatingPayment]
  );

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <Sidebar>
      <Payment
        title="Payments"
        columns={columns}
        rows={paymentRows}
      />

      <DynamicPopup
        open={uploadPopupOpen}
        onClose={handleCloseUploadPopup}
        title="Upload Receipt"
        description="Upload payment receipt to mark this payment as paid."
        fileUpload
        fileValue={selectedFile}
        onFileChange={(file) => setSelectedFile(file)}
        buttonText="Upload & Mark Paid"
        onSubmit={handleUploadSubmit}
        disableSubmit={!selectedFile || isUploadingDocument || isUpdatingPayment}
      />
    </Sidebar>
  );
}
