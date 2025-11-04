"use client";

import StatusChip from "@/components/StatusChip";
import { statusColors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";

export const adminProjectColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "clients", headerName: "Clients", flex: 1 },
  { field: "modules", headerName: "Modules", flex: 1 },
  { field: "duration", headerName: "Duration", flex: 1 },
  { field: "startdate", headerName: "Start Date", flex: 1 },
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

export const adminProjectRows = [
  {
    id: 1,
    name: "Global Rollout – Manufacturing",
    clients: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    duration: "4 months",
    startdate: "2025-07-01",
    status: "Project started",
  },
  {
    id: 2,
    name: "Retail Implementation",
    clients: "RetailCo",
    modules: "SAP SD, Fiori",
    duration: "8 months",
    startdate: "2025-10-01",
    status: "To do",
  },
  {
    id: 3,
    name: "Supply Chain Optimization",
    clients: "LogiCo",
    modules: "SAP SCM, S/4HANA",
    duration: "12 months",
    startdate: "2025-11-01",
    status: "Negotiating",
  },
  {
    id: 4,
    name: "ERP Upgrade",
    clients: "TechFirm",
    modules: "SAP MM, S/4HANA",
    duration: "6 months",
    startdate: "TBD",
    status: "Interviewing",
  },
  {
    id: 5,
    name: "Finance Integration",
    clients: "BankCorp",
    modules: "SAP FI, S/4HANA",
    duration: "10 months",
    startdate: "N/A",
    status: "Not selected",
  },
  {
    id: 6,
    name: "E-commerce Platform Launch",
    clients: "WebRetail",
    modules: "SAP Commerce, S/4HANA",
    duration: "9 months",
    startdate: "2025-01-15",
    status: "Planning",
  },
  {
    id: 7,
    name: "Data Migration Project",
    clients: "DataSolutions",
    modules: "SAP BW, S/4HANA",
    duration: "11 months",
    startdate: "2026-04-01",
    status: "In progress",
  },
  {
    id: 8,
    name: "Global Rollout – Manufacturing",
    clients: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    duration: "4 months",
    startdate: "2025-07-01",
    status: "Project started",
  },
  {
    id: 9,
    name: "Retail Implementation",
    clients: "RetailCo",
    modules: "SAP SD, Fiori",
    duration: "8 months",
    startdate: "2025-10-01",
    status: "To do",
  },
  {
    id: 10,
    name: "Supply Chain Optimization",
    clients: "LogiCo",
    modules: "SAP SCM, S/4HANA",
    duration: "12 months",
    startdate: "2025-11-01",
    status: "Negotiating",
  },
  {
    id: 11,
    name: "ERP Upgrade",
    clients: "TechFirm",
    modules: "SAP MM, S/4HANA",
    duration: "6 months",
    startdate: "TBD",
    status: "Interviewing",
  },
  {
    id: 12,
    name: "Finance Integration",
    clients: "BankCorp",
    modules: "SAP FI, S/4HANA",
    duration: "10 months",
    startdate: "N/A",
    status: "Not selected",
  },
  {
    id: 13,
    name: "E-commerce Platform Launch",
    clients: "WebRetail",
    modules: "SAP Commerce, S/4HANA",
    duration: "9 months",
    startdate: "2025-01-15",
    status: "Planning",
  },
];
