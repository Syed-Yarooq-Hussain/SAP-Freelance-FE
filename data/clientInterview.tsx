"use client";

import { StatCardProps } from "@/components/StatCard";
import StatusDropdown from "@/components/StatusDropdown";
import { GridColDef } from "@mui/x-data-grid";

export const clientInterviewStats: StatCardProps[] = [
  {
    title: "Interview Requests",
    subtitle: 5,
    color: "linear-gradient(135deg,  #4680FF 50%, #97B7FF 100%)",
    icon: "MarkEmailUnreadIcon",
  },
  {
    title: "Interview Scheduled",
    subtitle: 3,
    color: "linear-gradient(135deg, #00997B 50%, #4BD7BB 100%)",
    icon: "EventAvailableIcon",
  },
  {
    title: "Reschedule Requests",
    subtitle: 4,
    color: "linear-gradient(135deg, #FFB64E 50%, #F6BD6C 100%)",
    icon: "UpdateIcon",
  },
  {
    title: "Rejected Interviews",
    subtitle: 3,
    color: "linear-gradient(135deg, #FF5471 50%, #FF99AB 100%)",
    icon: "HighlightOffIcon",
  },
];

export const clientInterviewColumns: GridColDef[] = [
  { field: "consultant", headerName: "Consultant", flex: 1 },
  { field: "projectname", headerName: "Project Name", flex: 2 },
  { field: "requestDate", headerName: "Request Date", flex: 1 },
  { field: "datetime", headerName: "Date – Time", flex: 2 },
  { field: "duration", headerName: "Duration", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => <StatusDropdown value={params.value} />,
  },
];

export const clientInterviewRows = [
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
