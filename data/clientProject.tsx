"use client";

import { StatCardProps } from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import { statusColors } from "@/utils/styles/colors";
import { GridColDef } from "@mui/x-data-grid";

export const clientProjectStats: StatCardProps[] = [
  {
    title: "Employer",
    subtitle: "Global Rollout",
    description: "18/6 month project – lead consultant",
    color: "linear-gradient(135deg,  #4680FF 50%, #97B7FF 100%)",
    icon: "WorkOutlineIcon",
  },
  {
    title: "Upcoming Employer",
    subtitle: "Rental Co.",
    description: "12-5-2025 – for 6 months – SD Lead",
    color: "linear-gradient(135deg, #00997B 50%, #4BD7BB 100%)",
    icon: "GroupWorkIcon",
  },
  {
    title: "Tasks",
    subtitle: "15",
    description: "1 is delayed",
    color: "linear-gradient(135deg, #FF5471 50%, #FF99AB 100%)",
    icon: "AssignmentTurnedInIcon",
  },
];

export const clientProjectColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "members", headerName: "Members", flex: 1 },
  { field: "duration", headerName: "Duration", flex: 1 },
  { field: "spend", headerName: "Spend", flex: 1 },
  { field: "startdate", headerName: "Start Date", flex: 1 },
  { field: "estimated", headerName: "Estimated", flex: 1 },
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
