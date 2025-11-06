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

export const projectInfoData = {
  projectName: "Global Rollout",
  clientName: "ManuCorp",
  industry: "Manufacturing",
  functionalScope: "file",
  technicalScope: "file",
  outOfScope: "file",
  startDate: "2025-07-01",
  duration: "14 months",
  module: "SAP SD, S/4HANA",
  status: "Project Started",
};

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
  { field: "details", headerName: "Details", flex: 3 },
  { field: "deadline", headerName: "Deadline", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => <StatusDropdown value={params.value} />,
  },
];

export const taskRows = [
  {
    id: 1,
    name: "Blueprint Documentation",
    details: "One of the cool things about this font generator is that you...",
    deadline: "15.09.2025",
    status: "In progress",
  },
  {
    id: 2,
    name: "Client workshop",
    details: "One of the cool things about this font generator is that you...",
    deadline: "19.09.2025",
    status: "To do",
  },
  {
    id: 3,
    name: "Blueprint Documentation",
    details: "One of the cool things about this font generator is that you...",
    deadline: "15.09.2025",
    status: "In progress",
  },
  {
    id: 4,
    name: "Blueprint Documentation",
    details: "One of the cool things about this font generator is that you...",
    deadline: "15.09.2025",
    status: "In progress",
  },
  {
    id: 5,
    name: "Client workshop",
    details: "One of the cool things about this font generator is that you...",
    deadline: "19.09.2025",
    status: "To do",
  },
  {
    id: 6,
    name: "Data entry",
    details: "One of the cool things about this font generator is that you...",
    deadline: "05.08.2025",
    status: "Delayed",
  },
  {
    id: 7,
    name: "Client workshop",
    details: "One of the cool things about this font generator is that you...",
    deadline: "19.09.2025",
    status: "To do",
  },
  {
    id: 8,
    name: "Data entry",
    details: "One of the cool things about this font generator is that you...",
    deadline: "05.08.2025",
    status: "Delayed",
  },
];

export const milestoneColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "details", headerName: "Details", flex: 4 },
  { field: "deadline", headerName: "Deadline", flex: 2 },
  {
    field: "status",
    headerName: "Status",
    flex: 2,
    renderCell: (params) => <StatusDropdown value={params.value} />,
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => console.log("Edit")}
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
            onClick={() => console.log("Delete")}
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

export const milestoneRows = [
  {
    id: 1,
    name: "Blueprint Documentation",
    details: "One of the cool things about this font generator is that you...",
    deadline: "15.09.2025",
    status: "In progress",
  },
  {
    id: 2,
    name: "Client workshop",
    details: "One of the cool things about this font generator is that you...",
    deadline: "19.09.2025",
    status: "To do",
  },
  {
    id: 3,
    name: "Blueprint Documentation",
    details: "One of the cool things about this font generator is that you...",
    deadline: "15.09.2025",
    status: "In progress",
  },
  {
    id: 4,
    name: "Blueprint Documentation",
    details: "One of the cool things about this font generator is that you...",
    deadline: "15.09.2025",
    status: "In progress",
  },
  {
    id: 5,
    name: "Client workshop",
    details: "One of the cool things about this font generator is that you...",
    deadline: "19.09.2025",
    status: "To do",
  },
  {
    id: 6,
    name: "Data entry",
    details: "One of the cool things about this font generator is that you...",
    deadline: "05.08.2025",
    status: "Delayed",
  },
  {
    id: 7,
    name: "Client workshop",
    details: "One of the cool things about this font generator is that you...",
    deadline: "19.09.2025",
    status: "To do",
  },
  {
    id: 8,
    name: "Data entry",
    details: "One of the cool things about this font generator is that you...",
    deadline: "05.08.2025",
    status: "Delayed",
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

export const milestoneData = {
  name: "Blueprint Documentation",
  dependencies: "Scope and Objectives",
  details: "One of the cool things about this font generator is that you...",
  deadline: "15.09.2025",
  status: "In progress",
};
