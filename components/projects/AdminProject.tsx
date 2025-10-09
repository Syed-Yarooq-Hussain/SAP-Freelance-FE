"use client";

import DataTable from "@/components/DataTable";
import StatusChip from "@/components/StatusChip";
import { statusColors } from "@/utils/styles/colors";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

const taskColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "clients", headerName: "Clients", flex: 1 },
  { field: "modules", headerName: "Modules", flex: 2 },
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

const taskRows = [
  {
    id: 1,
    name: "Global Rollout – Manufacturing",
    clients: "Siemens",
    modules: "SAP SD, S/4HANA",
    duration: "6 months",
    startdate: "2025-07-01",
    status: "In progress",
  },
  {
    id: 2,
    name: "Retail Implementation",
    clients: "Carrefour",
    modules: "SAP SD, Fiori",
    duration: "8 months",
    startdate: "2025-10-01",
    status: "To do",
  },
  {
    id: 3,
    name: "Supply Chain Optimization",
    clients: "Nestle",
    modules: "SAP SCM, S/4HANA",
    duration: "12 months",
    startdate: "2025-11-01",
    status: "Delayed",
  },
  {
    id: 4,
    name: "ERP Upgrade",
    clients: "Unilever",
    modules: "SAP MM, S/4HANA",
    duration: "TBD",
    startdate: "TBD",
    status: "To do",
  },
  {
    id: 5,
    name: "Finance Integration",
    clients: "Coca-Cola",
    modules: "SAP FI, S/4HANA",
    duration: "N/A",
    startdate: "N/A",
    status: "In progress",
  },
];

export default function AdminProject() {
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
        title="Created Projects"
        columns={taskColumns}
        rows={taskRows}
        pageSize={10}
      />
    </Box>
  );
}
