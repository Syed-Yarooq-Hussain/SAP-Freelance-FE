"use client";

import AdminConsultantActionCell from "@/components/AdminConsultantActionCell";
import { StatCardProps } from "@/components/StatCard";
import { GridColDef } from "@mui/x-data-grid";

export const adminStatsConfig: Omit<StatCardProps, "subtitle">[] = [
  {
    title: "Total Consultants",
    color: "#134481",
    icon: "QueryStatsIcon",
    variant: "outlined",
  },

  {
    title: "Total Clients",
    color: "#2563EB",
    icon: "PeopleAltIcon",
    variant: "outlined",
  },

  {
    title: "Pending Profile",
    color: "#64748B",
    icon: "CurrencyExchangeIcon",
    variant: "outlined",
  },

  {
    title: "Active Projects",
    color: "#0F766E",
    icon: "BallotIcon",
    variant: "outlined",
  },

  {
    title: "Active Consultant",
    color: "#1E293B",
    icon: "WorkOutlineIcon",
    variant: "outlined",
  },

  {
    title: "Active Clients",
    color: "#475569",
    icon: "GroupWorkIcon",
    variant: "outlined",
  },

  {
    title: "Interviews this Week",
    color: "#0369A1",
    icon: "EventAvailableIcon",
    variant: "outlined",
  },

  {
    title: "Upcoming Projects",
    color: "#334155",
    icon: "UpdateIcon",
    variant: "outlined",
  },
];

export const adminConsultantColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1.5 },
  { field: "coremodules", headerName: "Modules (Core)", flex: 1.5 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 1.5 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <AdminConsultantActionCell consultantId={params.row.consultantId} />
    ),
  },
];
