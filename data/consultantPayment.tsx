"use client";

import AppButton from "@/components/Button";
import { Box, Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const consultantPaymentColumns: GridColDef[] = [
  { field: "project", headerName: "Project", flex: 2 },
  {
    field: "duedates",
    headerName: "Month",
    flex: 1.5,
    renderCell: (params) => <strong>{params.value}</strong>,
  },
  { field: "totalHours", headerName: "Hours", flex: 1 },
  { field: "amount", headerName: "Amount", flex: 2 },
  {
    field: "status",
    headerName: "Status",
    flex: 2,
    renderCell: (params) => (
      <Chip
        size="small"
        label={params.value || "Pending"}
        color={String(params.value).toLowerCase() === "paid" ? "success" : "warning"}
        variant={
          String(params.value).toLowerCase() === "paid" ? "filled" : "outlined"
        }
      />
    ),
  },
  {
    field: "pdfUrl",
    headerName: "PDF",
    flex: 2,
    renderCell: (params) => {
      const pdfUrl = params.value as string;

      if (!pdfUrl) {
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
          label="View"
          colorKey="BLUE"
          variant="outlined"
          width={90}
          onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
        />
      );
    },
  },
];
