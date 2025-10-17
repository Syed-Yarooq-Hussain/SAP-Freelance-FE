"use client";

import AppButton from "@/components/Button";
import StatusDropdown from "@/components/StatusDropdown";
import { buttonColors } from "@/utils/styles/colors";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const consultantPaymentColumns: GridColDef[] = [
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
    renderCell: (params) => <StatusDropdown value={params.value} />,
  },
  {
    field: "invoice",
    headerName: "Invoice",
    flex: 2,
    renderCell: (params) => {
      const label = params.value;
      if (label === "-") {
        return (
          <Box
            component="span"
            sx={{ color: "text.secondary", fontSize: "0.875rem" }}
          >
            {label}
          </Box>
        );
      }

      const colorKey = buttonColors[label] || "GREY";
      return <AppButton label={label} colorKey={colorKey} />;
    },
  },
];

export const consultantPaymentRows = [
  {
    id: 1,
    project: "Retail Implementation",
    duedates: "10.09.2025",
    amount: "2,500",
    status: "Paid",
    invoice: "Download",
  },
  {
    id: 2,
    project: "Retail Implementation",
    duedates: "10.10.2025",
    amount: "3,500",
    status: "Pending",
    invoice: "Download",
  },
  {
    id: 3,
    project: "Retail Implementation",
    duedates: "10.11.2025",
    amount: "3,500",
    status: "Overdue",
    invoice: "Download",
  },
];
