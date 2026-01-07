"use client";

import { StatCardProps } from "@/components/StatCard";
import StatusDropdown from "@/components/StatusDropdown";
import { colors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";

export const consultantInterviewStats: StatCardProps[] = [
  {
    title: "Interview Requests",
    color: colors.BLUE,
    icon: "MarkEmailUnreadIcon",
  },
  {
    title: "Interview Scheduled",
    color: colors.BLUE,
    icon: "EventAvailableIcon",
  },
  {
    title: "Reschedule Requests",
    color: colors.BLUE,
    icon: "UpdateIcon",
  },
  {
    title: "Rejected Interviews",
    color: colors.BLUE,
    icon: "HighlightOffIcon",
  },
];

export const getConsultantInterviewColumns: GridColDef[] = [
  { field: "consultant", headerName: "Members", flex: 1 },
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
