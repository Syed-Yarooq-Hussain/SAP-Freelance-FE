"use client";

import { useUpdateProject } from "@/actions/projects/useaddProjectDetails";
import { useProjectPayments } from "@/actions/payments/useProjectPayments";
import { useUploadDocument } from "@/actions/documents/useUploadDocument";
import { useUpdatePaymentStatus } from "@/actions/payments/useUpdatePaymentStatus";
import AppButton from "@/components/Button";
import MilestoneBillingOverview from "./MilestoneBillingOverview";
import DataTable from "@/components/DataTable";
import InvoiceDetails from "@/components/InvoiceDetails";
import DynamicPopup from "@/components/Popup";
import StatCard from "@/components/StatCard";
import {
  invoiceData,
  teamBuilderPaymentStats,
  createTeamBuilderPaymentMilestoneColumns,
  createTeamBuilderPaymentCustomRangeColumns,
} from "@/data/teamBuilder";
import type { PaymentTableRow, IProjectPaymentDTO } from "@/types/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import { APP_ROUTES } from "@/utils/app_routes";
import {
  calculatePaymentWithCharges,
  formatCurrency,
} from "@/utils/payments";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function TeamPayments({
  projectId,
  onDiscard,
  completionRoute = APP_ROUTES.CLIENT.DASHBOARD,
}: {
  projectId: string;
  onDiscard: () => void;
  completionRoute?: string;
}) {
  const router = useRouter();
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<Set<string>>(
    new Set()
  );
  const [paymentRows, setPaymentRows] = useState<PaymentTableRow[]>([]);
  const [currentUploadPaymentId, setCurrentUploadPaymentId] = useState<
    string | null
  >(null);
  const [uploadDialogMessage, setUploadDialogMessage] = useState("");

  const updateProject = useUpdateProject();
  const { toast } = useToast();
  const { mutate: fetchPayments } = useProjectPayments();
  const { mutate: uploadDocument, isPending: isUploadingDocument } =
    useUploadDocument();
  const { mutate: updatePaymentStatus, isPending: isUpdatingPayment } =
    useUpdatePaymentStatus();

  // Fetch payments on mount
  useEffect(() => {
    fetchPayments(projectId, {
      onSuccess: (res) => {
        const payments = res.data ?? [];

        // Map and transform API data to PaymentTableRow
        const rows: PaymentTableRow[] = payments.map(
          (payment: IProjectPaymentDTO) => {
            const charges = calculatePaymentWithCharges(payment.amount);
            return {
              ...payment,
              id: String(payment.id),
              selected: false,
              showUpload: false,
              baseAmount: charges.baseAmount,
              vat: charges.vat,
              serviceCharge: charges.serviceCharge,
              totalAmount: charges.total,
            };
          }
        );

        setPaymentRows(rows);

        // Auto-select first unpaid payment, otherwise keep the first row visible in details.
        if (rows.length > 0) {
          const firstUnpaid = rows.find((row) => !row.is_paid);
          setSelectedPayments(new Set([String(firstUnpaid?.id ?? rows[0].id)]));
        }
      },
      onError: (err) => {
        toast(err.message || "Failed to load payments", "error");
      },
    });
  }, [projectId, fetchPayments, toast]);

  const handleToggleRange = () => {
    setIsCustomRange(!isCustomRange);
  };

  const handleCheckboxChange = useCallback((id: string, checked: boolean) => {
    const paymentId = String(id);
    setSelectedPayments(checked ? new Set([paymentId]) : new Set());
  }, []);

  const handlePaidClick = useCallback((id: string) => {
    const paymentId = String(id);
    setSelectedPayments(new Set([paymentId]));
    setCurrentUploadPaymentId(paymentId);
    setSelectedFile(null);
    setUploadedFileName("");
    setUploadDialogMessage(
      "Upload receipt if available. Submit without file to mark paid without slip."
    );
    setOpenPopup(true);
  }, []);

  const handleClosePopup = () => {
    setOpenPopup(false);
    setCurrentUploadPaymentId(null);
    setSelectedFile(null);
    setUploadedFileName("");
    setUploadDialogMessage("");
  };

  const markPaymentPaid = (paymentId: string, docId: string | null) => {
    setPaymentRows((prev) => {
      return prev.map((row) =>
        String(row.id) === paymentId
          ? {
              ...row,
              is_paid: true,
              doc_id: docId,
              selected: true,
            }
          : row
      );
    });
    setSelectedPayments(new Set([paymentId]));
  };

  const handleUploadSubmit = async () => {
    if (!currentUploadPaymentId) return;

    const payment = paymentRows.find(
      (p) => String(p.id) === currentUploadPaymentId
    );
    if (!payment) return;

    if (!selectedFile) {
      updatePaymentStatus(
        {
          paymentId: currentUploadPaymentId,
          payload: {
            is_paid: true,
            doc_id: null,
            payment_module: payment.payment_module,
          },
        },
        {
          onSuccess: () => {
            toast("Payment marked as paid", "success");
            markPaymentPaid(currentUploadPaymentId, null);
            handleClosePopup();
          },
          onError: (err) => {
            toast(err.message || "Failed to mark payment as paid", "error");
          },
        }
      );
      return;
    }

    uploadDocument(
      { file: selectedFile, type: "client_payment" },
      {
        onSuccess: (res) => {
          const docId = res.data?.id;
          if (!docId) {
            toast("Failed to get document ID from upload", "error");
            return;
          }

          updatePaymentStatus(
            {
              paymentId: currentUploadPaymentId,
              payload: {
                is_paid: true,
                doc_id: docId,
                payment_module: payment.payment_module,
              },
            },
            {
              onSuccess: () => {
                toast("Payment marked as paid and document uploaded", "success");
                markPaymentPaid(currentUploadPaymentId, docId);
                handleClosePopup();
              },
              onError: (err) => {
                toast(err.message || "Failed to mark payment as paid", "error");
              },
            }
          );
        },
        onError: (err) => {
          toast(err.message || "Failed to upload document", "error");
        },
      }
    );
  };

  const handleFileSelect = (file: File) => {
    if (file) {
      setUploadedFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleDeleteFile = () => {
    setUploadedFileName("");
    setSelectedFile(null);
  };

  const handleStartProject = () => {
    if (selectedPayments.size === 0) {
      toast("Please select at least one payment", "warning");
      return;
    }

    updateProject.mutate(
      {
        projectId,
        body: { status: "in_progress" },
      },
      {
        onSuccess: () => {
          toast("Project started!", "success");
          router.push(completionRoute);
        },
        onError: (err) => {
          toast(err.message, "error");
        },
      }
    );
  };

  // Get selected payment details for invoice
  const selectedPayment = useMemo(() => {
    const paymentId = Array.from(selectedPayments)[0];
    return paymentRows.find((p) => String(p.id) === paymentId);
  }, [selectedPayments, paymentRows]);

  // Update rows with selection state
  const displayRows = useMemo(() => {
    return paymentRows.map((row) => ({
      ...row,
      selected: selectedPayments.has(String(row.id)),
    }));
  }, [paymentRows, selectedPayments]);

  // Create columns with handlers
  const milestoneColumns = useMemo(
    () =>
      createTeamBuilderPaymentMilestoneColumns(
        handleCheckboxChange,
        handlePaidClick
      ),
    [handleCheckboxChange, handlePaidClick]
  );

  const customRangeColumns = useMemo(
    () =>
      createTeamBuilderPaymentCustomRangeColumns(
        handleCheckboxChange,
        handlePaidClick
      ),
    [handleCheckboxChange, handlePaidClick]
  );

  const invoiceDetailsData = selectedPayment
    ? {
        invoiceName: selectedPayment.milestone?.name || `Custom payment #${selectedPayment.id}`,
        accountTitle: "John Doe",
        accountNumber: "1234563322566311556311556315",
        iban: "BAC1235US5600033225566315",
        invoiceNumber: String(selectedPayment.id),
        amount: selectedPayment.baseAmount.toFixed(2),
        serviceCharges: selectedPayment.serviceCharge.toFixed(2),
        vat: "10%",
        vatAmount: `$${selectedPayment.vat.toFixed(2)}`,
        totalAmount: selectedPayment.totalAmount.toFixed(2),
      }
    : invoiceData;

  const paymentStats = useMemo(() => {
    const totals = paymentRows.reduce(
      (acc, row) => {
        acc.projectCost += row.totalAmount;
        acc.systemCharges += row.serviceCharge;
        acc.consultantCost += row.baseAmount;
        acc.taxesApplied += row.vat;
        return acc;
      },
      {
        projectCost: 0,
        systemCharges: 0,
        consultantCost: 0,
        taxesApplied: 0,
      }
    );

    const values = [
      totals.projectCost,
      totals.systemCharges,
      totals.consultantCost,
      totals.taxesApplied,
    ];

    return teamBuilderPaymentStats.map((stat, index) => ({
      ...stat,
      subtitle: formatCurrency(values[index] ?? 0),
    }));
  }, [paymentRows]);

  return (
    <Box
      sx={{
        p: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
        mt: 3,
      }}
    >
      <MilestoneBillingOverview projectId={projectId} />
      <Grid container spacing={2}>
        {paymentStats.map((s, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mt={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, textTransform: "capitalize" }}
            >
              Issued payments ({isCustomRange ? "Custom Range" : "Milestone / Custom"})
            </Typography>

            <AppButton
              label={`Pay by ${isCustomRange ? "Milestones" : "Custom Range"}`}
              colorKey="BLUE"
              width={200}
              onClick={handleToggleRange}
            />
          </Box>

          <DataTable
            title=""
            columns={
              isCustomRange
                ? customRangeColumns
                : milestoneColumns
            }
            rows={displayRows}
            pageSize={10}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InvoiceDetails
            invoiceName={invoiceDetailsData.invoiceName}
            accountTitle={invoiceDetailsData.accountTitle}
            accountNumber={invoiceDetailsData.accountNumber}
            iban={invoiceDetailsData.iban}
            invoiceNumber={invoiceDetailsData.invoiceNumber}
            amount={invoiceDetailsData.amount}
            serviceCharges={invoiceDetailsData.serviceCharges}
            vat={invoiceDetailsData.vat}
            vatAmount={invoiceDetailsData.vatAmount}
            totalAmount={invoiceDetailsData.totalAmount}
            showUpload={!!selectedPayment}
            onUpload={() => {
              if (selectedPayment) {
                handlePaidClick(String(selectedPayment.id));
              } else {
                toast("Select a payment first", "warning");
              }
            }}
            uploadedFileName={uploadedFileName}
            onDeleteFile={handleDeleteFile}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <AppButton
          label="Back"
          colorKey="RED"
          width={180}
          onClick={onDiscard}
        />
        <AppButton
          label="Start the Project"
          colorKey="BLUE"
          width={180}
          onClick={handleStartProject}
          disabled={updateProject.isPending}
        />
      </Box>

      <DynamicPopup
        open={openPopup}
        onClose={handleClosePopup}
        title="Upload Receipt"
        description={uploadDialogMessage}
        fileUpload={true}
        onFileChange={handleFileSelect}
        fileValue={selectedFile}
        buttonText={
          selectedFile ? "Upload & Mark Paid" : "Mark Paid Without Slip"
        }
        onSubmit={handleUploadSubmit}
        disableSubmit={isUploadingDocument || isUpdatingPayment}
      />
    </Box>
  );
}
