"use client";

import DataTable from "@/components/DataTable";
import StatusDropdown from "@/components/StatusDropdown";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

const taskColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "deadline", headerName: "Deadline", flex: 2 },
  { field: "expirationDate", headerName: "Expiration Date", flex: 2 },
  { field: "client", headerName: "Client Name", flex: 2 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => <StatusDropdown value={params.value} />,
  },
];

const taskRows = [
  {
    id: 1,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "ManuCorp",
    status: "Signed",
  },
  {
    id: 2,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "ManuCorp",
    status: "Pending",
  },
  {
    id: 3,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "ManuCorp",
    status: "Rejected",
  },
  {
    id: 4,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "RetailCo",
    status: "Signed",
  },
  {
    id: 5,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "RetailCo",
    status: "Pending",
  },
  {
    id: 6,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "RetailCo",
    status: "Rejected",
  },
  {
    id: 7,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "LogicCo",
    status: "Signed",
  },
  {
    id: 8,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "LogicCo",
    status: "Pending",
  },
  {
    id: 9,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "LogicCo",
    status: "Rejected",
  },
  {
    id: 10,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "TechFirm",
    status: "Signed",
  },
  {
    id: 11,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "TechFirm",
    status: "Pending",
  },
  {
    id: 12,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "TechFirm",
    status: "Rejected",
  },
  {
    id: 13,
    name: "NDA",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "BankCorp",
    status: "Signed",
  },
  {
    id: 14,
    name: "Service",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "BankCorp",
    status: "Pending",
  },
  {
    id: 15,
    name: "Property ownership",
    deadline: "15.09.2025",
    expirationDate: "15.09.2028",
    client: "BankCorp",
    status: "Rejected",
  },
];

export default function ClientDocuments() {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <DataTable
        title="Signed Contract"
        columns={taskColumns}
        rows={taskRows}
        pageSize={10}
      />
    </Box>
  );
}
