"use client";

import { StatCardProps } from "@/components/StatCard";
import { colors } from "@/utils/styles/colors";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const adminStats: StatCardProps[] = [
  {
    title: "Number of Projects",
    subtitle: 360,
    color: "linear-gradient(135deg, #97B7FF 0%, #3088B7 100%)",
    icon: "QueryStatsIcon",
  },

  {
    title: "Interviews Scheduled",
    subtitle: 10,
    color: "linear-gradient(135deg, #4BD7BB 0%, #519F85 100%)",
    icon: "PeopleAltIcon",
  },

  {
    title: "Total Spend on Projects",
    subtitle: "$3000",
    color: "linear-gradient(135deg, #F6BD6C 0%, #024E76 100%)",
    icon: "CurrencyExchangeIcon",
  },

  {
    title: "Pending Invoices",
    subtitle: "$12,000",
    color: "linear-gradient(135deg, #FF99AB 0%, #005C8A 100%)",
    icon: "BallotIcon",
  },

  {
    title: "Active Consultant",
    subtitle: 230,
    color: "linear-gradient(135deg, #0040CC 0%, #100858 100%)",
    icon: "WorkOutlineIcon",
  },

  {
    title: "Active Clients",
    subtitle: 160,
    color: "linear-gradient(135deg, #0BA45D 0%, #0C2D17 100%)",
    icon: "GroupWorkIcon",
  },

  {
    title: "Interviews this Week",
    subtitle: 20,
    color: "linear-gradient(135deg, #FB9400 0%, #653B00 100%)",
    icon: "EventAvailableIcon",
  },

  {
    title: "Upcoming Projects",
    subtitle: 5,
    color: "linear-gradient(135deg, #B3001E 0%, #200005 100%)",
    icon: "UpdateIcon",
  },
];

export const adminConsultantColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1.5,
    renderCell: (params) => (
      <Typography sx={{ fontWeight: 500 }}>{params.value}</Typography>
    ),
  },
  { field: "modules", headerName: "Modules", flex: 1.5 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    sortable: false,
    renderCell: () => (
      <Box display="flex" alignItems="center" gap={1.5}>
        <Tooltip title="Accept">
          <IconButton
            size="small"
            sx={{
              color: colors.GREEN,
              "&:hover": { bgcolor: `${colors.GREEN}15` },
            }}
          >
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reject">
          <IconButton
            size="small"
            sx={{
              color: colors.RED,
              "&:hover": { bgcolor: `${colors.RED}15` },
            }}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

export const adminConsultantRows = [
  {
    id: 1,
    avatar: "/public/vercel.svg",
    name: "Marvin McKinney",
    modules: "SAP MM, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$15/hour",
  },
  {
    id: 2,
    avatar: "/public/vercel.svg",
    name: "Savannah Nguyen",
    modules: "SAP SD, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$20/hour",
  },
  {
    id: 3,
    avatar: "/public/vercel.svg",
    name: "Ralph Edwards",
    modules: "SAP SD, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$22/hour",
  },
  {
    id: 4,
    avatar: "/public/vercel.svg",
    name: "Vincent Zhang",
    modules: "SAP FI, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$19/hour",
  },
  {
    id: 5,
    avatar: "/public/vercel.svg",
    name: "Noah Brown",
    modules: "SAP CRM, HANA",
    experience: "9 Years",
    hourlyRate: "$23/hour",
  },
  {
    id: 6,
    avatar: "/public/vercel.svg",
    name: "Isabella Martinez",
    modules: "SAP ABAP, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$14/hour",
  },
  {
    id: 7,
    avatar: "/public/vercel.svg",
    name: "Ethan Johnson",
    modules: "SAP PI, Fiori",
    experience: "9 Years",
    hourlyRate: "$26/hour",
  },
];
