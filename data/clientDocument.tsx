"use client";

import colors from "@/utils/styles/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const clientContractColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 3,
    renderCell: (params) => (
      <strong style={{ textDecoration: "underline" }}>{params.value}</strong>
    ),
  },
  { field: "date", headerName: "Date", flex: 3 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: () => (
      <Stack direction="row" spacing={1}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => console.log("Edit")}
            sx={{
              color: colors.BLUE,
              "&:hover": { bgcolor: `${colors.BLUE}15` },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => console.log("Delete")}
            sx={{
              color: colors.RED,
              "&:hover": { bgcolor: `${colors.RED}15` },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  },
];

export const clientContractRows = [
  { id: 1, name: "NDA", date: "15.09.2028" },
  { id: 2, name: "Service", date: "15.09.2028" },
  { id: 3, name: "Property ownership", date: "15.09.2028" },
  { id: 4, name: "Project contract", date: "15.09.2028" },
];

export const adminContractRows = [
  { id: 11, name: "NDA", date: "15.09.2028" },
  { id: 12, name: "Service", date: "15.09.2028" },
  { id: 13, name: "Property ownership", date: "15.09.2028" },
  { id: 14, name: "Project contract", date: "15.09.2028" },
];

export const signContractRows = [
  { id: 21, name: "NDA", date: "15.09.2028" },
  { id: 22, name: "Service", date: "15.09.2028" },
  { id: 23, name: "Project contract", date: "15.09.2028" },
];
