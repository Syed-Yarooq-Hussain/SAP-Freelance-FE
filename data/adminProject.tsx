"use client";

import StatusChip from "@/components/StatusChip";
import { statusColors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Button } from "@mui/material";
import { isProjectSetupStatus } from "@/utils/adminProjectNavigation";
import type { AdminProjectTableRow } from "@/types/projects";

export const getAdminProjectColumns = (
  onOpen: (row: AdminProjectTableRow) => void
): GridColDef<AdminProjectTableRow>[] => [
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
  {
    field: "actions",
    headerName: "Action",
    minWidth: 120,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Button
        size="small"
        startIcon={<VisibilityOutlinedIcon />}
        onClick={(event) => {
          event.stopPropagation();
          onOpen(params.row);
        }}
        sx={{ textTransform: "none", fontWeight: 700 }}
      >
        {isProjectSetupStatus(params.row.status) ? "Continue Setup" : "View"}
      </Button>
    ),
  },
];
