"use client";

import { GridColDef } from "@mui/x-data-grid";

export const adminConsultantColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "modules", headerName: "Modules", flex: 2 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];

export const adminConsultantRows = [
  {
    id: 1,
    avatar: "/images/team1.jpg",
    name: "Marvin McKinney",
    modules: "SAP MM, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$15/hour",
    status: "Active",
  },
  {
    id: 2,
    avatar: "/images/team2.jpg",
    name: "Savannah Nguyen",
    modules: "SAP SD, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$20/hour",
    status: "Inactive",
  },
  {
    id: 3,
    avatar: "/images/team3.jpg",
    name: "Albert Flores",
    modules: "SAP SD, Fiori",
    experience: "9 Years",
    hourlyRate: "$18/hour",
    status: "Active",
  },
];
