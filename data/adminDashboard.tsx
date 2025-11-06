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
    color: "linear-gradient(135deg,  #4680FF 50%, #97B7FF 100%)",
    icon: "QueryStatsIcon" as const,
  },
  {
    title: "Interviews Scheduled",
    subtitle: 10,
    color: "linear-gradient(135deg, #00997B 50%, #4BD7BB 100%)",
    icon: "PeopleAltIcon" as const,
  },
  {
    title: "Total Spend on Projects",
    subtitle: "$3000",
    color: "linear-gradient(135deg, #FFB64E 50%, #F6BD6C 100%)",
    icon: "CurrencyExchangeIcon" as const,
  },
  {
    title: "Pending Invoices",
    subtitle: "$12,000",
    color: "linear-gradient(135deg, #FF5471 50%, #FF99AB 100%)",
    icon: "BallotIcon" as const,
  },
  {
    title: "Active Consultant",
    subtitle: 230,
    color: "linear-gradient(135deg, #002DFF, #00125B)",
    icon: "WorkOutlineIcon" as const,
  },
  {
    title: "Active Clients",
    subtitle: 160,
    color: "linear-gradient(135deg, #0DBA7C, #004A2D)",
    icon: "GroupWorkIcon" as const,
  },
  {
    title: "Interviews this Week",
    subtitle: 20,
    color: "linear-gradient(135deg, #FF9800, #7A4300)",
    icon: "EventAvailableIcon" as const,
  },
  {
    title: "Upcoming Projects",
    subtitle: 5,
    color: "linear-gradient(135deg, #FF3B5F, #2B0010)",
    icon: "UpdateIcon" as const,
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
    avatar: "/img/u1.png",
    name: "Marvin McKinney",
    modules: "SAP MM, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$15/hour",
  },
  {
    id: 2,
    avatar: "/img/u2.png",
    name: "Savannah Nguyen",
    modules: "SAP SD, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$20/hour",
  },
  {
    id: 3,
    avatar: "/img/u3.png",
    name: "Ralph Edwards",
    modules: "SAP SD, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$22/hour",
  },
  {
    id: 4,
    avatar: "/img/u4.png",
    name: "Vincent Zhang",
    modules: "SAP FI, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$19/hour",
  },
  {
    id: 5,
    avatar: "/img/u5.png",
    name: "Noah Brown",
    modules: "SAP CRM, HANA",
    experience: "9 Years",
    hourlyRate: "$23/hour",
  },
  {
    id: 6,
    avatar: "/img/u6.png",
    name: "Isabella Martinez",
    modules: "SAP ABAP, S/4HANA",
    experience: "9 Years",
    hourlyRate: "$14/hour",
  },
  {
    id: 7,
    avatar: "/img/u7.png",
    name: "Ethan Johnson",
    modules: "SAP PI, Fiori",
    experience: "9 Years",
    hourlyRate: "$26/hour",
  },
];
