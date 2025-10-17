"use client";

import StatusDropdown from "@/components/StatusDropdown";
import { STATUS } from "@/constants/status_dropdown";
import { GridColDef } from "@mui/x-data-grid";

export const consultantDocumentColumns: GridColDef[] = [
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
  { field: "client", headerName: "Client Name", flex: 2 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => (
      <StatusDropdown value={params.value} onRejectClick={() => {}} />
    ),
  },
];

export const consultantDocumentRows = [
  {
    id: 1,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "ManuCorp",
    status: STATUS.SIGNED,
  },
  {
    id: 2,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "ManuCorp",
    status: STATUS.PENDING,
  },
  {
    id: 3,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "ManuCorp",
    status: STATUS.REJECTED,
  },
  {
    id: 4,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "RetailCo",
    status: STATUS.SIGNED,
  },
  {
    id: 5,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "RetailCo",
    status: STATUS.PENDING,
  },
  {
    id: 6,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "RetailCo",
    status: STATUS.REJECTED,
  },
  {
    id: 7,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "LogicCo",
    status: STATUS.SIGNED,
  },
  {
    id: 8,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "LogicCo",
    status: STATUS.PENDING,
  },
  {
    id: 9,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "LogicCo",
    status: STATUS.REJECTED,
  },
  {
    id: 10,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "TechFirm",
    status: STATUS.SIGNED,
  },
  {
    id: 11,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "TechFirm",
    status: STATUS.PENDING,
  },
  {
    id: 12,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "TechFirm",
    status: STATUS.REJECTED,
  },
  {
    id: 13,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "BankCorp",
    status: STATUS.SIGNED,
  },
  {
    id: 14,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "BankCorp",
    status: STATUS.PENDING,
  },
  {
    id: 15,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "BankCorp",
    status: STATUS.REJECTED,
  },
];
