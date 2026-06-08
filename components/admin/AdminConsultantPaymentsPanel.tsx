"use client";

import {
  adminConsultantPaymentsQueryKey,
  useAdminConsultantPayments,
  useMarkAdminConsultantPaymentPaid,
} from "@/actions/admin/useAdminConsultantPayments";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import { useToast } from "@/providers/ToastProvider";
import type { IAdminConsultantPayment } from "@/types/adminConsultantPayments";
import { formatCurrencyValue } from "@/utils/payments";
import { Alert, Box, Chip, CircularProgress, Paper } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const text = (...values: unknown[]) =>
  values.find((value) => typeof value === "string" && value.trim()) as
    | string
    | undefined;

export default function AdminConsultantPaymentsPanel() {
  const { data, isLoading, error } = useAdminConsultantPayments();
  const markPaid = useMarkAdminConsultantPaymentPaid();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleMarkPaid = (row: IAdminConsultantPayment) => {
    const pdfUrl = window.prompt("Enter payment slip PDF URL");
    if (!pdfUrl) return;

    markPaid.mutate(
      { paymentId: row.id, body: { pdf_url: pdfUrl } },
      {
        onSuccess: () => {
          toast("Payment marked as paid", "success");
          queryClient.invalidateQueries({
            queryKey: adminConsultantPaymentsQueryKey,
          });
        },
        onError: (err) => toast(err.message || "Failed to mark payment paid", "error"),
      }
    );
  };

  const columns = useMemo<GridColDef<IAdminConsultantPayment>[]>(
    () => [
      {
        field: "consultant_name",
        headerName: "Consultant name",
        minWidth: 170,
        flex: 1.2,
        renderCell: ({ row }) =>
          text(row.user?.username, row.user?.name, row.consultant?.name, row.consultant?.user?.username) || "N/A",
      },
      {
        field: "consultant_email",
        headerName: "Consultant email",
        minWidth: 190,
        flex: 1.3,
        renderCell: ({ row }) =>
          text(row.user?.email, row.consultant?.email, row.consultant?.user?.email) || "N/A",
      },
      {
        field: "project",
        headerName: "Project",
        minWidth: 150,
        flex: 1,
        renderCell: ({ row }) => row.project?.name || row.project_name || "N/A",
      },
      {
        field: "client",
        headerName: "Client",
        minWidth: 150,
        flex: 1,
        renderCell: ({ row }) =>
          text(row.client?.company_name, row.client?.username, row.client?.name, row.project?.company_name, row.project?.client?.company_name, row.client_name) || "N/A",
      },
      {
        field: "milestone",
        headerName: "Milestone",
        minWidth: 150,
        flex: 1,
        renderCell: ({ row }) => row.milestone?.name || row.milestone_name || "N/A",
      },
      {
        field: "task",
        headerName: "Task",
        minWidth: 130,
        flex: 1,
        renderCell: ({ row }) => row.task?.name || row.task_name || "-",
      },
      { field: "month", headerName: "Month", minWidth: 110, flex: 0.8 },
      { field: "log_date", headerName: "Log Date", minWidth: 120, flex: 0.9 },
      {
        field: "hours",
        headerName: "Hours",
        minWidth: 90,
        flex: 0.7,
        align: "right",
      },
      {
        field: "amount",
        headerName: "Amount",
        minWidth: 120,
        flex: 0.8,
        align: "right",
        renderCell: ({ row }) => formatCurrencyValue(row.amount ?? 0),
      },
      {
        field: "bill_type",
        headerName: "Bill Type",
        minWidth: 110,
        flex: 0.8,
        renderCell: ({ row }) => row.bill_type || "N/A",
      },
      {
        field: "is_paid",
        headerName: "Paid Status",
        minWidth: 130,
        flex: 0.8,
        renderCell: ({ row }) => (
          <Chip
            size="small"
            label={row.is_paid ? "Paid" : "Unpaid"}
            color={row.is_paid ? "success" : "warning"}
            variant={row.is_paid ? "filled" : "outlined"}
          />
        ),
      },
      {
        field: "pdf_url",
        headerName: "PDF URL",
        minWidth: 120,
        flex: 0.8,
        renderCell: ({ row }) =>
          row.pdf_url ? (
            <AppButton
              label="View"
              width={80}
              variant="outlined"
              onClick={() => window.open(row.pdf_url!, "_blank", "noopener,noreferrer")}
            />
          ) : (
            "-"
          ),
      },
      {
        field: "actions",
        headerName: "Action",
        minWidth: 140,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<IAdminConsultantPayment>) =>
          params.row.is_paid ? (
            <AppButton label="Paid" width={100} disabled colorKey="GREEN" />
          ) : (
            <AppButton
              label={markPaid.isPending ? "Saving..." : "Mark Paid"}
              width={110}
              disabled={markPaid.isPending}
              colorKey="GREEN"
              onClick={() => handleMarkPaid(params.row)}
            />
          ),
      },
    ],
    [markPaid.isPending]
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 360 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error.message || "Failed to load consultant payments"}</Alert>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <DataTable
        title="Consultant Payments"
        columns={columns}
        rows={(data?.data ?? []).map((row, index) => ({
          ...row,
          id: row.id ?? index,
        }))}
        pageSize={10}
        rowClickable={false}
      />
    </Paper>
  );
}
