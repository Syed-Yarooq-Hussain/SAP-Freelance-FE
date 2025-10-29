"use client";

import { GridColDef } from "@mui/x-data-grid";

export const clientConsultantColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "modules", headerName: "Modules", flex: 2 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
  { field: "projectName", headerName: "Project Name", flex: 1 },
];

export const clientConsultantRows = [
  {
    id: 1,
    avatar: "/images/team1.jpg",
    name: "Marvin McKinney",
    modules: "SAP MM, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$15/hour",
    projectName: "ERP Upgrade",
    meeting: "Send Invite",
  },
  {
    id: 2,
    avatar: "/images/team2.jpg",
    name: "Savannah Nguyen",
    modules: "SAP SD, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$20/hour",
    projectName: "ERP Upgrade",
    meeting: "Send Invite",
  },
  {
    id: 3,
    avatar: "/images/team3.jpg",
    name: "Albert Flores",
    modules: "SAP SD, Fiori",
    experience: "9 Years",
    hourlyRate: "$18/hour",
    projectName: "ERP Upgrade",
    meeting: "Reschedule",
  },
];
