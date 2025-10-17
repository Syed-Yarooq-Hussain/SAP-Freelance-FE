"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const clientDocumentColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 2,
    renderCell: (params) => (
      <strong style={{ textDecoration: "underline" }}>{params.value}</strong>
    ),
  },
  { field: "deadline", headerName: "Deadline", flex: 2 },
  { field: "expirationDate", headerName: "Expiration Date", flex: 2 },
  { field: "projects", headerName: "Projects", flex: 1 },
  { field: "used", headerName: "Used", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: () => (
      <Stack direction="row" spacing={1}>
        <EditIcon color="primary" fontSize="small" />
        <DeleteIcon color="error" fontSize="small" />
      </Stack>
    ),
  },
];

export const clientDocumentRows = [
  {
    id: 1,
    name: "NDA",
    deadline: "15.09.2028",
    expirationDate: "15.09.2028",
    projects: 5,
    used: 50,
  },
  {
    id: 2,
    name: "Service",
    deadline: "15.09.2028",
    expirationDate: "15.09.2028",
    projects: 5,
    used: 50,
  },
  {
    id: 3,
    name: "Property ownership",
    deadline: "15.09.2028",
    expirationDate: "15.09.2028",
    projects: 5,
    used: 50,
  },
  {
    id: 4,
    name: "Project contract",
    deadline: "15.09.2028",
    expirationDate: "15.09.2028",
    projects: 5,
    used: 50,
  },
];
