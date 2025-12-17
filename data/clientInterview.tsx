"use client";

import { StatCardProps } from "@/components/StatCard";
import StatusDropdown from "@/components/StatusDropdown";
import { colors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";

export const clientInterviewStats: StatCardProps[] = [
  {
    title: "Interview Requests",
    subtitle: 5,
    color: colors.BLUE,
    icon: "MarkEmailUnreadIcon",
  },
  {
    title: "Interview Scheduled",
    subtitle: 3,
    color: colors.BLUE,
    icon: "EventAvailableIcon",
  },
  {
    title: "Reschedule Requests",
    subtitle: 4,
    color: colors.BLUE,
    icon: "UpdateIcon",
  },
  {
    title: "Rejected Interviews",
    subtitle: 3,
    color: colors.BLUE,
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
