"use client";

import { StatCardProps } from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import colors, { statusColors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";

export const consultantProjectStats: StatCardProps[] = [
  {
    title: "Current Employer",
    color: colors.BLUE,
    icon: "WorkOutlineIcon",
  },
  {
    title: "Upcoming Employer",
    color: colors.BLUE,
    icon: "GroupWorkIcon",
  },
  {
    title: "Tasks",
    color: colors.BLUE,
    icon: "AssignmentTurnedInIcon",
  },
];

export const consultantProjectColumns: GridColDef[] = [
  { field: "project_name", headerName: "Name", flex: 2 },
  { field: "client_name", headerName: "Clients", flex: 1 },
  { field: "modules", headerName: "Modules", flex: 2 },
  { field: "duration", headerName: "Duration", flex: 1 },
  { field: "start_date", headerName: "Start Date", flex: 1 },
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
