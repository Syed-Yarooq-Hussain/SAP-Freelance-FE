"use client";

import StatusChip from "@/components/StatusChip";
import { statusColors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";

export const adminInterviewColumns: GridColDef[] = [
  { field: "client", headerName: "Client", flex: 1 },
  { field: "consultant", headerName: "Consultant", flex: 1 },
  { field: "requestdate", headerName: "Request Date", flex: 1 },
  { field: "datetime", headerName: "Date-Time", flex: 1 },
  { field: "duration", headerName: "Duration", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      const colorName =
        statusColors[params.value as keyof typeof statusColors] || "GREY";
      return <StatusChip label={params.value} color={colorName} />;
    },
  },
];

export const adminInterviewRows = [];
