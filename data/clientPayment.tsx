"use client";

import AppButton from "@/components/Button";
import StatusDropdown from "@/components/StatusDropdown";
import { buttonColors } from "@/utils/styles/colors";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const clientPaymentColumns: GridColDef[] = [
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

