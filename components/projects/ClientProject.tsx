"use client";

import DataTable from "@/components/DataTable";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import StatusChip from "@/components/StatusChip";
import { APP_ROUTES } from "@/utils/app_routes";
import { statusColors } from "@/utils/styles/colors";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

const projectStats: StatCardProps[] = [
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

const taskColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "clients", headerName: "Clients", flex: 1 },
  { field: "modules", headerName: "Modules", flex: 1 },
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
    clients: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    duration: "4 months",
    startdate: "2025-07-01",
    status: "Project started",
  },
  {
    id: 2,
    name: "Retail Implementation",
    clients: "RetailCo",
    modules: "SAP SD, Fiori",
    duration: "8 months",
    startdate: "2025-10-01",
    status: "To do",
  },
  {
    id: 3,
    name: "Supply Chain Optimization",
    clients: "LogiCo",
    modules: "SAP SCM, S/4HANA",
    duration: "12 months",
    startdate: "2025-11-01",
    status: "Negotiating",
  },
  {
    id: 4,
    name: "ERP Upgrade",
    clients: "TechFirm",
    modules: "SAP MM, S/4HANA",
    duration: "6 months",
    startdate: "TBD",
    status: "Interviewing",
  },
  {
    id: 5,
    name: "Finance Integration",
    clients: "BankCorp",
    modules: "SAP FI, S/4HANA",
    duration: "10 months",
    startdate: "N/A",
    status: "In progress",
  },
];

export default function ClientProject() {
  const router = useRouter();

  return (
    <Box>
      <DashboardStats
        stats={projectStats}
        containerProps={{ marginBottom: "30px" }}
      />

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <DataTable
          title=""
          columns={taskColumns}
          rows={taskRows}
          pageSize={10}
          onRowClick={(params) =>
            router.push(`${APP_ROUTES.PROJECTS}/${params.id}`)
          }
        />
      </Box>
    </Box>
  );
}
