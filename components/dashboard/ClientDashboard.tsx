"use client";

import SidebarInfo from "@/components/DashboardSidebarInfo";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import { buttonColors, statusColors } from "@/utils/styles/colors";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { GridColDef } from "@mui/x-data-grid";
import Announcement from "../Announcement";
import AppButton from "../Button";
import DataTable from "../DataTable";
import StatusChip from "../StatusChip";
import StatusDropdown from "../StatusDropdown";
import VisibilityChart from "../VisibilityChart";

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
      const colorName =
        statusColors[params.value as keyof typeof statusColors] || "GREY";
      return <StatusChip label={params.value} color={colorName} />;
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
  { field: "project", headerName: "Project", flex: 1 },
  { field: "dueDate", headerName: "Due Dates", flex: 1 },
  { field: "amount", headerName: "Amount", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => <StatusDropdown value={params.value} />,
  },
  {
    field: "invoice",
    headerName: "Invoice",
    flex: 1,
    renderCell: (params) => {
      const label = params.value;

      if (label === "-") {
        return (
          <Box
            component="span"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            {label}
          </Box>
        );
      }

      const colorKey = buttonColors[label] || "GREY";
      return <AppButton label={label} colorKey={colorKey} />;
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
    invoice: "Upload receipt",
  },
  {
    id: 3,
    project: "Retail Implementation",
    dueDate: "15.09.2025",
    amount: "3,500",
    status: "Overdue",
    invoice: "Upload receipt",
  },
];

const consultantStats: StatCardProps[] = [
  {
    title: "Number of Project",
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
    title: "Total spend on Projects",
    subtitle: "$3000",
    color: "linear-gradient(135deg, #FFB64E, #F6BD6C)",
    icon: "CurrencyExchangeIcon",
  },
  {
    title: "Pending Invoices",
    subtitle: "$12,000",
    color: "linear-gradient(135deg, #FF5471, #FF99AB)",
    icon: "BallotIcon",
  },
];

const clientAnnouncements = [
  "System maintenance scheduled for this weekend. Expect brief downtime.",
  "Check out our new blog post on maximizing your freelance opportunities!",
  "New feature rollout: Enhanced invoice tracking module launching next week!",
  "Reminder: Update your profile to get more relevant project matches.",
];

export default function ClientDashboard() {
  return (
    <Box>
      <Announcement items={clientAnnouncements} />
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
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "background.paper",
              mb: 2,
            }}
          >
            <DataTable
              title="Project Highlights"
              columns={interviewColumns}
              rows={interviewRows}
              pageSize={5}
              showViewMore={true}
            />
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "background.paper",
            }}
          >
            <DataTable
              title="Payment Pending"
              columns={taskColumns}
              rows={taskRows}
              pageSize={5}
              showViewMore={true}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SidebarInfo
            sections={[
              {
                title: "Initialize Projects",
                items: [
                  {
                    type: "button",
                    buttonText: "Start new project",
                    buttonColor: "GREEN",
                  },
                  {
                    type: "text",
                    label: "Team Confirmation",
                    value: "SAP FI, SAP S/4HANA",
                  },
                  {
                    type: "button",
                    buttonText: "Go to completion",
                    buttonColor: "BLUE",
                  },
                  {
                    type: "text",
                    label: "Project Scope",
                    value: "ABAP, Fiori",
                  },
                  {
                    type: "button",
                    buttonText: "Go to completion",
                    buttonColor: "BLUE",
                  },
                ],
              },
              {
                title: "Projects & Teams",
                items: [
                  { type: "text", value: "Global Rollout" },
                  {
                    type: "avatars",
                    avatars: ["/img/u1.png", "/img/u2.png", "/img/u3.png"],
                  },
                  { type: "text", value: "Rental Co." },
                  {
                    type: "avatars",
                    avatars: ["/img/u4.png", "/img/u5.png", "/img/u6.png"],
                  },
                ],
              },
              {
                title: "System Alert",
                items: [
                  {
                    type: "text",
                    label: "Interview invite from RetailCo. – 02-Aug",
                  },
                  { type: "text", label: "Profile approved by Admin" },
                ],
              },
              {
                title: "Payment Alert",
                items: [
                  {
                    type: "text",
                    label: 'Payment made on "RetailCo."',
                  },
                  { type: "text", label: 'Payment due for "RetailCo."' },
                ],
              },
            ]}
          />{" "}
        </Grid>{" "}
      </Grid>{" "}
    </Box>
  );
}
