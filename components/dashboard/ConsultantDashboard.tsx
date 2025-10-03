"use client";

import SidebarInfo from "@/components/DashboardSidebarInfo";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import VisibilityChart from "@/components/VisibilityChart";
import statusColors from "@/utils/styles/colors";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { GridColDef } from "@mui/x-data-grid";
import AppButton from "../Button";
import DataTable from "../DataTable";
import StatusChip from "../StatusChip";

const interviewColumns: GridColDef[] = [
  { field: "project", headerName: "Project", flex: 1 },
  {
    field: "client",
    headerName: "Client",
    flex: 1,
    renderCell: (params) => <strong>{params.value}</strong>,
  },
  { field: "modules", headerName: "Modules", flex: 1 },
  { field: "duration", headerName: "Duration", flex: 1 },
  { field: "startDate", headerName: "Start Date", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      const color = statusColors[params.value as keyof typeof statusColors];
      return <StatusChip label={params.value} color={color} />;
    },
  },
];

const interviewRows = [
  {
    id: 1,
    project: "ERP Upgrade",
    client: "TechFirm",
    modules: "SAP MM, S/4HANA",
    duration: "6 months",
    startDate: "TBD",
    status: "Under review",
  },
  {
    id: 2,
    project: "Global Rollout – Manufacturing",
    client: "ManuCorp",
    modules: "SAP SD, S/4HANA",
    duration: "14 months",
    startDate: "2025-07-01",
    status: "Confirmed",
  },
  {
    id: 3,
    project: "Retail Implementation",
    client: "RetailCo",
    modules: "SAP SD, Fiori",
    duration: "8 months",
    startDate: "2025-10-01",
    status: "In progress",
  },
];

const taskColumns: GridColDef[] = [
  { field: "project", headerName: "Project", flex: 2 },
  { field: "dueDate", headerName: "Due Dates", flex: 1 },
  { field: "amount", headerName: "Amount", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      const color = statusColors[params.value as keyof typeof statusColors];
      return <StatusChip label={params.value} color={color} />;
    },
  },
  {
    field: "invoice",
    headerName: "Invoice",
    flex: 1,
    renderCell: (params) => {
      return params.value === "Download" ? (
        <AppButton label="Download" color="primary" />
      ) : (
        "-"
      );
    },
  },
];

const taskRows = [
  {
    id: 1,
    project: "Retail Implementation",
    dueDate: "15.09.2025",
    amount: "2,500",
    status: "Paid",
    invoice: "Download",
  },
  {
    id: 2,
    project: "Retail Implementation",
    dueDate: "15.09.2025",
    amount: "3,500",
    status: "Pending",
    invoice: "-",
  },
  {
    id: 3,
    project: "Retail Implementation",
    dueDate: "15.09.2025",
    amount: "3,500",
    status: "Overdue",
    invoice: "-",
  },
];

const consultantStats: StatCardProps[] = [
  {
    title: "Appeared in Search",
    subtitle: 360,
    color: "linear-gradient(135deg, #4680FF, #97B7FF)",
    icon: "QueryStatsIcon",
  },
  {
    title: "Interview Scheduled",
    subtitle: 10,
    color: "linear-gradient(135deg, #00997B, #4BD7BB)",
    icon: "PeopleAltIcon",
  },
  {
    title: "Projected Monthly Revenue",
    subtitle: "$3000",
    color: "linear-gradient(135deg, #FFB64E, #F6BD6C)",
    icon: "CurrencyExchangeIcon",
  },
  {
    title: "Invoices Status",
    subtitle: 13,
    color: "linear-gradient(135deg, #FF5471, #FF99AB)",
    icon: "BallotIcon",
  },
];

export default function ConsultantDashboard() {
  return (
    <Box>
      <DashboardStats
        stats={consultantStats}
        containerProps={{ marginBottom: "30px" }}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              mb: 2,
              bgcolor: "background.paper",
            }}
          >
            <VisibilityChart />
          </Box>

          <Box
            mb={2}
            borderRadius={2}
            boxShadow={2}
            bgcolor="background.paper"
            p={2}
          >
            <DataTable
              title="Project Pipeline"
              columns={interviewColumns}
              rows={interviewRows}
              pageSize={5}
              showViewMore={true}
            />
          </Box>

          <Box
            mb={2}
            borderRadius={2}
            boxShadow={2}
            bgcolor="background.paper"
            p={2}
          >
            <DataTable
              title="Financial List"
              columns={taskColumns}
              rows={taskRows}
              pageSize={5}
              showViewMore={true}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <SidebarInfo />
        </Grid>
      </Grid>
    </Box>
  );
}
