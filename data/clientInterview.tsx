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
    renderCell: (params) => (
      <StatusDropdown
        value={params.row.status}
        onChange={(newStatus) => params.row.onStatusChange?.(newStatus)}
      />
    ),
  },
];
