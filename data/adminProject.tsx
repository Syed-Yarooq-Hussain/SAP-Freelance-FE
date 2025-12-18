"use client";

import StatusChip from "@/components/StatusChip";
import { statusColors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";

export const adminProjectColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "client_name", headerName: "Client", flex: 1 },
  { field: "coremodules", headerName: "Modules (Core)", flex: 1.5 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 1.5 },
  { field: "duration", headerName: "Duration", flex: 1 },
  { field: "start_date", headerName: "Start Date", flex: 1 },
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
