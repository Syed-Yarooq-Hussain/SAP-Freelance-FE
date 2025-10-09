"use client";

import DataTable from "@/components/DataTable";
import StatusChip from "@/components/StatusChip";
import { statusColors } from "@/utils/styles/colors";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

const taskColumns: GridColDef[] = [
  { field: "client", headerName: "Client", flex: 2 },
  { field: "modules", headerName: "Modules", flex: 2 },
  { field: "requestDate", headerName: "Request date", flex: 1 },
  { field: "datetime", headerName: "Date – Time", flex: 2 },
  { field: "duration", headerName: "Duration", flex: 1 },
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
    client: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    requestDate: "10.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 2,
    client: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    requestDate: "10.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Request",
  },
  {
    id: 3,
    client: "LogicCo",
    modules: "SAP SCM, S/4HANA",
    requestDate: "10.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 4,
    client: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    requestDate: "10.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Reschedule",
  },
  {
    id: 5,
    client: "RetailCo",
    modules: "SAP SD, Fiori",
    requestDate: "08.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 6,
    client: "TechFirm",
    modules: "SAP MM, S/4HANA",
    requestDate: "08.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 7,
    client: "TechFirm",
    modules: "SAP MM, S/4HANA",
    requestDate: "08.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Request",
  },
  {
    id: 8,
    client: "RetailCo",
    modules: "SAP SD, Fiori",
    requestDate: "08.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Reschedule",
  },
  {
    id: 9,
    client: "BankCorp",
    modules: "SAP FI, S/4HANA",
    requestDate: "06.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Rejected",
  },
  {
    id: 10,
    client: "BankCorp",
    modules: "SAP FI, S/4HANA",
    requestDate: "05.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Request",
  },
  {
    id: 11,
    client: "LogicCo",
    modules: "SAP SCM, S/4HANA",
    requestDate: "06.09.2019",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Reschedule",
  },
];

export default function AdminInterview() {
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
        title="Meetings"
        columns={taskColumns}
        rows={taskRows}
        pageSize={10}
      />
    </Box>
  );
}
