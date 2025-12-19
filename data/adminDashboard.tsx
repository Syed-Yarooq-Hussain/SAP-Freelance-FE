"use client";

import { StatCardProps } from "@/components/StatCard";
import { colors } from "@/utils/styles/colors";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const adminStatsConfig: Omit<StatCardProps, "subtitle">[] = [
  {
    title: "Total Consultants",
    color: "linear-gradient(135deg, #97B7FF 0%, #3088B7 100%)",
    icon: "QueryStatsIcon",
  },

  {
    title: "Total Clients",
    color: "linear-gradient(135deg, #4BD7BB 0%, #519F85 100%)",
    icon: "PeopleAltIcon",
  },

  {
    title: "Pending Profile",
    color: "linear-gradient(135deg, #F6BD6C 0%, #024E76 100%)",
    icon: "CurrencyExchangeIcon",
  },

  {
    title: "Active Projects",
    color: "linear-gradient(135deg, #FF99AB 0%, #005C8A 100%)",
    icon: "BallotIcon",
  },

  {
    title: "Active Consultant",
    color: "linear-gradient(135deg, #0040CC 0%, #100858 100%)",
    icon: "WorkOutlineIcon",
  },

  {
    title: "Active Clients",
    color: "linear-gradient(135deg, #0BA45D 0%, #0C2D17 100%)",
    icon: "GroupWorkIcon",
  },

  {
    title: "Interviews this Week",
    color: "linear-gradient(135deg, #FB9400 0%, #653B00 100%)",
    icon: "EventAvailableIcon",
  },

  {
    title: "Upcoming Projects",
    color: "linear-gradient(135deg, #B3001E 0%, #200005 100%)",
    icon: "UpdateIcon",
  },
];

export const adminConsultantColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1.5,
  },
  { field: "coremodules", headerName: "Modules (Core)", flex: 1.5 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 1.5 },
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
