"use client";

import SidebarInfo from "@/components/DashboardSidebarInfo";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import VisibilityChart from "@/components/VisibilityChart";
import { getCurrentMonth } from "@/utils/dateUtils";
import { buttonColors, statusColors } from "@/utils/styles/colors";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { GridColDef } from "@mui/x-data-grid";
import Announcement from "../Announcement";
import AppButton from "../Button";
import DataTable from "../DataTable";
import StatusChip from "../StatusChip";
import StatusDropdown from "../StatusDropdown";

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
    title: `Invoices Values (${getCurrentMonth()})`,
    subtitle: "$12,000",
    color: "linear-gradient(135deg, #FF5471, #FF99AB)",
    icon: "BallotIcon",
  },
];

const consultantAnnouncements = [
  "You appeared in 25 searches this week — great job!",
  "Reminder: Add your latest certification to improve visibility.",
  "New dashboard insights are now live in your analytics panel!",
  "System Alert: Scheduled downtime on Saturday 3–4 AM UTC.",
];

export default function ConsultantDashboard() {
  return (
    <Box>
      <Announcement items={consultantAnnouncements} />
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
              title="Project Pipeline"
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
              title="Financial List"
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
                title: "Skills & Certifications",
                items: [
                  {
                    type: "text",
                    label: "Primary SAP modules",
                    value: "SAP FI, SAP S/4HANA",
                    subValue: "4 year experience",
                  },
                  {
                    type: "text",
                    label: "Technical skills",
                    value: "ABAP, Fiori",
                    subValue: "4 year experience",
                  },
                ],
              },
              {
                title: "Engagement",
                items: [
                  {
                    type: "text",
                    label: "Current Employer",
                    value: "Global Rollout",
                    subValue: "14 months – lead consultant\nSAP SD, S/4HANA",
                  },
                  {
                    type: "text",
                    label: "Upcoming Employer",
                    value: "Rental Co.",
                    subValue: "6 months – SD Team lead\nSAP SD, Fiori",
                  },
                ],
              },
              {
                title: "System Alert",
                items: [
                  {
                    type: "text",
                    label: "Interview invite from RetailCo – 02-Aug",
                  },
                  { type: "text", label: "Profile approved by Admin" },
                ],
              },
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
