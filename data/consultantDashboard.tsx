"use client";

import AppButton from "@/components/Button";
import { SidebarSectionInfo } from "@/components/DashboardSidebarInfo";
import { CalendarEvent } from "@/components/MonthlyCalendar";
import { StatCardProps } from "@/components/StatCard";
import StatusChip from "@/components/StatusChip";
import StatusDropdown from "@/components/StatusDropdown";
import { currentMonth, currentYear, getCurrentMonth } from "@/utils/dateTime";
import colors, { buttonColors, statusColors } from "@/utils/styles/colors";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const consultantStats: StatCardProps[] = [
  {
    title: "Appeared in Search",
    subtitle: 360,
    color: colors.BLUE,
    icon: "QueryStatsIcon",
  },
  {
    title: "Interview Scheduled",
    subtitle: 10,
    color: colors.BLUE,
    icon: "PeopleAltIcon",
  },
  {
    title: "Projected Monthly Revenue",
    subtitle: "$3000",
    color: colors.BLUE,
    icon: "CurrencyExchangeIcon",
  },
  {
    title: `Invoices Values (${getCurrentMonth()})`,
    subtitle: "$12,000",
    color: colors.BLUE,
    icon: "BallotIcon",
  },
];

export const consultantAnnouncements = [
  "You appeared in 25 searches this week — great job!",
  "Reminder: Add your latest certification to improve visibility.",
  "New dashboard insights are now live in your analytics panel!",
  "System Alert: Scheduled downtime on Saturday 3–4 AM UTC.",
];

export const interviewColumns: GridColDef[] = [
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

export const taskColumns: GridColDef[] = [
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
            sx={{ color: "text.secondary", fontSize: "0.875rem" }}
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

export const consultantSidebar: SidebarSectionInfo[] = [
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
        subValue: "14 months – Lead Consultant\nSAP SD, S/4HANA",
      },
      {
        type: "text",
        label: "Upcoming Employer",
        value: "Rental Co.",
        subValue: "6 months – SD Team Lead\nSAP SD, Fiori",
      },
    ],
  },
  {
    title: "System Alert",
    items: [
      { type: "text", label: "Interview invite from RetailCo – 02-Aug" },
      { type: "text", label: "Profile approved by Admin" },
    ],
  },
];
