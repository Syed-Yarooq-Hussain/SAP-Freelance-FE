"use client";

import AppButton from "@/components/Button";
import type { ClientPaymentRow } from "@/types/client";
import { Box, Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const createClientPaymentColumns = (
  onMarkPaid: (row: ClientPaymentRow) => void,
  isUpdating = false
): GridColDef<ClientPaymentRow>[] => [
  { field: "project", headerName: "Project", flex: 2 },
  {
    field: "duedates",
    headerName: "Due Dates",
    flex: 2,
    renderCell: (params) => <strong>{params.value}</strong>,
  },
  { field: "amount", headerName: "Amount", flex: 2 },
  {
    field: "status",
    headerName: "Status",
    flex: 2,
    renderCell: (params) => (
      <Chip
        size="small"
        label={params.row.is_paid ? "Paid" : "Unpaid"}
        color={params.row.is_paid ? "success" : "warning"}
        variant={params.row.is_paid ? "filled" : "outlined"}
      />
    ),
  },
  {
    field: "payment",
    headerName: "Payment",
    flex: 2,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <AppButton
        label="Mark Paid"
        colorKey="BLUE"
        width={110}
        disabled={params.row.is_paid || isUpdating}
        onClick={() => onMarkPaid(params.row)}
      />
    ),
  },
  {
    field: "receiptUrl",
    headerName: "View Receipt",
    flex: 2,
    renderCell: (params) => {
      const receiptUrl = params.row.receiptUrl;

      if (!receiptUrl) {
        return (
          <Box
            component="span"
            sx={{ color: "text.secondary", fontSize: "0.875rem" }}
          >
            {" "}
          </Box>
        );
      }

      return (
        <AppButton
          label="View Receipt"
          colorKey="BLUE"
          variant="outlined"
          width={120}
          onClick={() => window.open(receiptUrl, "_blank", "noopener,noreferrer")}
        />
      );
    },
  },
];

export const clientPaymentColumns = createClientPaymentColumns(() => undefined);

