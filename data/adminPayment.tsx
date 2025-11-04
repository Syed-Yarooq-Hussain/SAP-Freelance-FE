"use client";

import StatusChip from "@/components/StatusChip";
import { statusColors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";

export const adminPaymentColumns: GridColDef[] = [
  { field: "client", headerName: "Client", flex: 1 },
  { field: "project", headerName: "Project", flex: 2 },
  { field: "consultant", headerName: "Consultant", flex: 1 },
  { field: "duedate", headerName: "Due Date", flex: 1 },
  { field: "amount", headerName: "Amount", flex: 1 },
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

export const adminPaymentRowsUpcoming = [
  {
    id: 1,
    client: "LogiCo",
    project: "Retail Implementation",
    consultant: "Marvin McKinney",
    duedate: "2025-09-10",
    amount: "2,500",
    status: "Pending",
  },
  {
    id: 2,
    client: "BankCorp",
    project: "Retail Implementation",
    consultant: "Robert Fox",
    duedate: "2025-10-10",
    amount: "3,500",
    status: "Pending",
  },
  {
    id: 3,
    client: "RetailCo",
    project: "Retail Implementation",
    consultant: "Leslie Alexander",
    duedate: "2025-11-10",
    amount: "3,500",
    status: "Pending",
  },
];

export const adminPaymentRowsMade = [
  {
    id: 1,
    client: "FerroTech",
    project: "SAP S/4HANA Migration",
    consultant: "Eleanor Pena",
    duedate: "2025-07-05",
    amount: "4,200",
    status: "Paid",
  },
  {
    id: 2,
    client: "AeroFin",
    project: "Finance Analytics Rollout",
    consultant: "Wade Warren",
    duedate: "2025-07-20",
    amount: "5,750",
    status: "Paid",
  },
  {
    id: 3,
    client: "GreenGrid",
    project: "ESG Reporting Setup",
    consultant: "Theresa Webb",
    duedate: "2025-08-01",
    amount: "2,950",
    status: "Paid",
  },
  {
    id: 4,
    client: "HealthPoint",
    project: "Patient Portal Upgrade",
    consultant: "Guy Hawkins",
    duedate: "2025-08-13",
    amount: "3,100",
    status: "Paid",
  },
];

export const adminPaymentRowsOutstanding = [
  {
    id: 1,
    client: "CityLogistics",
    project: "Warehouse Optimization",
    consultant: "Savannah Nguyen",
    duedate: "2025-06-20",
    amount: "2,200",
    status: "Overdue",
  },
  {
    id: 2,
    client: "MediServe",
    project: "Claims Automation",
    consultant: "Courtney Henry",
    duedate: "2025-06-28",
    amount: "3,900",
    status: "Overdue",
  },
  {
    id: 3,
    client: "NovaMart",
    project: "Omni-channel Integration",
    consultant: "Dianne Russell",
    duedate: "2025-07-02",
    amount: "2,750",
    status: "Overdue",
  },
  {
    id: 4,
    client: "QuickRide",
    project: "Driver App Revamp",
    consultant: "Ralph Edwards",
    duedate: "2025-07-08",
    amount: "1,980",
    status: "Overdue",
  },
];

export const adminPaymentRows = [
  ...adminPaymentRowsUpcoming,
  ...adminPaymentRowsMade,
  ...adminPaymentRowsOutstanding,
];
