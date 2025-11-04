"use client";

import StatusChip from "@/components/StatusChip";
import { statusColors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";

export const adminInterviewColumns: GridColDef[] = [
  { field: "client", headerName: "Client", flex: 1 },
  { field: "consultant", headerName: "Consultant", flex: 1 },
  { field: "requestdate", headerName: "Request Date", flex: 1 },
  { field: "datetime", headerName: "Date-Time", flex: 1 },
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

export const adminInterviewRows = [
  {
    id: 1,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 2,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 3,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 4,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 5,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 6,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 7,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 8,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 9,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 10,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 11,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 12,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
  {
    id: 13,
    client: "ManuCorp",
    consultant: "Dianne Russell",
    requestdate: "2019-09-10",
    datetime: "12.09.2019 - 12.53 PM",
    duration: "30 mins",
    status: "Confirmed",
  },
];
