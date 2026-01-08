"use client";

import AppButton from "@/components/Button";
import {
  SidebarSectionInfo,
  SidebarSectionItem,
} from "@/components/DashboardSidebarInfo";
import { StatCardProps } from "@/components/StatCard";
import StatusDropdown from "@/components/StatusDropdown";
import { APP_ROUTES } from "@/utils/app_routes";
import colors, { buttonColors } from "@/utils/styles/colors";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type OngoingProject = { id: string; name: string; step: number };

export const clientStats: StatCardProps[] = [
  {
    title: "Number of Projects",
    color: colors.BLUE,
    icon: "QueryStatsIcon",
  },
  {
    title: "Interviews Scheduled",
    color: colors.BLUE,
    icon: "PeopleAltIcon",
  },
  {
    title: "Total Spend on Projects",
    color: colors.BLUE,
    icon: "CurrencyExchangeIcon",
  },
  {
    title: "Pending Invoices",
    color: colors.BLUE,
    icon: "BallotIcon",
  },
];

export const clientAnnouncements = [
  "System maintenance scheduled for this weekend. Expect brief downtime.",
  "Check out our new blog post on maximizing your freelance opportunities!",
  "New feature rollout: Enhanced invoice tracking module launching next week!",
  "Reminder: Update your profile to get more relevant project matches.",
];

export const clientTaskColumns: GridColDef[] = [
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

export const getClientSidebar = (
  router: AppRouterInstance,
  ongoingProjects: OngoingProject[] = []
): SidebarSectionInfo[] => {
  const projectItems: SidebarSectionItem[] = ongoingProjects.flatMap((p) => [
    {
      type: "text",
      label: "Team Project",
      value: p.name,
    },
    {
      type: "button",
      buttonText: "Go to completion",
      buttonColor: "BLUE",
      onButtonClick: () => {
        const step = p.step ?? 2;
        router.push(`${APP_ROUTES.TEAMBUILDER}?step=${step}&projectId=${p.id}`);
      },
    },
  ]);

  return [
    {
      title: "Initialize Projects",
      items: [
        {
          type: "button",
          buttonText: "Start new project",
          buttonColor: "GREEN",
          onButtonClick: () => {
            localStorage.removeItem("tb_project_id");
            localStorage.removeItem("tb_project_name");
            localStorage.removeItem("tb_project_in_progress");
            router.push(`${APP_ROUTES.TEAMBUILDER}?step=1`);
          },
        },

        ...projectItems.slice(0, 10),
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
      ],
    },

    {
      title: "System Alert",
      items: [
        { type: "text", label: "Interview invite from RetailCo – 02-Aug" },
      ],
    },
  ];
};
