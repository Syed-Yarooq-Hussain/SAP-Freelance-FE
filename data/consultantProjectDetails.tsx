"use client";

import { StatCardProps } from "@/components/StatCard";
import StatusDropdown from "@/components/StatusDropdown";
import { ProjectInfoData } from "@/types/projects";
import { GridColDef } from "@mui/x-data-grid";

export const projectStats: StatCardProps[] = [
  {
    title: "Employer",
    subtitle: "Global Rollout",
    description: "18/6 month project – lead consultant",
    color: "linear-gradient(135deg, #4680FF 50%, #97B7FF 100%)",
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

export const projectInfoData: ProjectInfoData = {
  name: "SAP Migration System",
  clientIndustry: "John Doe - Retail Industry",
  module: "SAP FI",
  functionalScope: "Billing automation, AP/AR workflows",
  technicalScope: "ABAP enhancements, CDS Views",
  outOfScope: "Legacy integrations",
  start_date: "2024-01-10",
  duration: "6 months",
  status: "Active",
};

export const teamMembers = [
  {
    name: "Marvin McKinney",
    role: "Lead Consultant",
    avatar: "/images/team1.jpg",
  },
  { name: "Savannah Nguyen", role: "Consultant", avatar: "/images/team2.jpg" },
  { name: "Albert Flores", role: "Consultant", avatar: "/images/team3.jpg" },
  { name: "Ralph Edwards", role: "Consultant", avatar: "/images/team4.jpg" },
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

export const milestoneColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "dependencies", headerName: "Dependencies", flex: 2 },
  { field: "details", headerName: "Details", flex: 2 },
  { field: "deadline", headerName: "Deadline", flex: 2 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => <StatusDropdown value={params.value} />,
  },
];
