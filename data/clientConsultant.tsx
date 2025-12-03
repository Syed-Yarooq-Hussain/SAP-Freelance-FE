"use client";

import { GridColDef } from "@mui/x-data-grid";

export const clientConsultantColumns: GridColDef[] = [
  { field: "name", headerName: "Name" },
  { field: "coremodules", headerName: "Modules (Core)", flex: 2 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 2 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
  { field: "projectName", headerName: "Project Name", flex: 1 },
];

