"use client";

import { StatCardProps } from "@/components/StatCard";
import StatusDropdown from "@/components/StatusDropdown";
import colors from "@/utils/styles/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const projectStats: StatCardProps[] = [
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

export const teamMembers = [
  {
    name: "Marvin McKinney",
    role: "Lead Consultant",
    avatar: "/images/team1.jpg",
  },
  {
    name: "Savannah Nguyen",
    role: "Consultant",
    avatar: "/images/team2.jpg",
  },
  {
    name: "Albert Flores",
    role: "Consultant",
    avatar: "/images/team3.jpg",
  },
  {
    name: "Ralph Edwards",
    role: "Consultant",
    avatar: "/images/team4.jpg",
  },
  {
    name: "Cameron Williamson",
    role: "Consultant",
    avatar: "/images/team5.jpg",
  },
];

export const taskColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "dependencies", headerName: "Dependencies", flex: 2 },
  { field: "details", headerName: "Details", flex: 2 },
  { field: "deadline", headerName: "Deadline", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => <StatusDropdown value={params.value} />,
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              params.row.onEdit?.();
            }}
            sx={{
              color: colors.BLUE,
              "&:hover": { bgcolor: `${colors.BLUE}15` },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              params.row.onDelete?.();
            }}
            sx={{
              color: colors.RED,
              "&:hover": { bgcolor: `${colors.RED}15` },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

export const milestoneColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "dependencies", headerName: "Dependencies", flex: 2 },
  { field: "details", headerName: "Details", flex: 2 },
  { field: "deadline", headerName: "Deadline", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 2,
    renderCell: (params) => <StatusDropdown value={params.value} />,
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              params.row.onEdit?.();
            }}
            sx={{
              color: colors.BLUE,
              "&:hover": { bgcolor: `${colors.BLUE}15` },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              params.row.onDelete?.();
            }}
            sx={{
              color: colors.RED,
              "&:hover": { bgcolor: `${colors.RED}15` },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

export const dependencyOptions = [
  "Scope and Objectives",
  "Kick-off Meeting",
  "Technical Design Draft",
  "Final Documentation",
  "Stakeholder Alignment",
];

export const assigneeOptions = [
  "Marvin McKinney",
  "Savannah Nguyen",
  "Albert Flores",
  "Ralph Edwards",
  "Cameron Williamson",
];

export const milestoneOptions = [
  "Blueprint Documentation",
  "Client Workshop",
  "Data Entry",
  "Kick-off Meeting",
];
