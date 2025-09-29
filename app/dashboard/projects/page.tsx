"use client";

import DashboardStats from "@/components/DashboardStats";
import ProjectInfoCard from "@/components/ProjectInfoCard";
import { StatCardProps } from "@/components/StatCard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { Box, Chip, ChipProps, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const projectStats: StatCardProps[] = [
  {
    title: "Employer",
    subtitle: "Global Rollout",
    description: "18-month project – lead consultant",
    color: "linear-gradient(135deg, #4680FF, #000000ff)",
    icon: <WorkOutlineIcon fontSize="large" />,
  },
  {
    title: "Upcoming Employer",
    subtitle: "Rental Co.",
    description: "12-5-2025 – for 6 months – SD Lead",
    color: "linear-gradient(135deg, #00997B, #000000ff)",
    icon: <GroupWorkIcon fontSize="large" />,
  },
  {
    title: "Tasks",
    subtitle: "15",
    description: "11 in daycycle",
    color: "linear-gradient(135deg, #FF5471, #000000)",
    icon: <AssignmentTurnedInIcon fontSize="large" />,
  },
];

const taskColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "details", headerName: "Details", flex: 2 },
  { field: "deadline", headerName: "Deadline", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      let color: ChipProps["color"] = "default";
      switch (params.value) {
        case "In progress":
          color = "success";
          break;
        case "Todo":
          color = "warning";
          break;
        case "Delayed":
          color = "error";
          break;
      }
      return <Chip label={params.value} color={color} size="small" />;
    },
  },
];

const taskRows = [
  {
    id: 1,
    name: "Blueprint Documentation",
    details: "Font generator is that you...",
    deadline: "18.09.2025",
    status: "In progress",
  },
  {
    id: 2,
    name: "Client workshop",
    details: "Font generator is that you...",
    deadline: "15.09.2025",
    status: "Todo",
  },
  {
    id: 3,
    name: "Data entry",
    details: "Font generator is that you...",
    deadline: "5.09.2025",
    status: "Delayed",
  },
  {
    id: 4,
    name: "Blueprint Documentation",
    details: "Font generator is that you...",
    deadline: "18.09.2025",
    status: "In progress",
  },
  {
    id: 5,
    name: "Client workshop",
    details: "Font generator is that you...",
    deadline: "15.09.2025",
    status: "Todo",
  },
  {
    id: 6,
    name: "Data entry",
    details: "Font generator is that you...",
    deadline: "5.09.2025",
    status: "Delayed",
  },
  {
    id: 7,
    name: "Data entry",
    details: "Font generator is that you...",
    deadline: "5.09.2025",
    status: "Delayed",
  },
  {
    id: 8,
    name: "Blueprint Documentation",
    details: "Font generator is that you...",
    deadline: "18.09.2025",
    status: "In progress",
  },
  {
    id: 9,
    name: "Client workshop",
    details: "Font generator is that you...",
    deadline: "15.09.2025",
    status: "Todo",
  },
  {
    id: 10,
    name: "Data entry",
    details: "Font generator is that you...",
    deadline: "5.09.2025",
    status: "Delayed",
  },
];

export default function ConsultantProject() {
  return (
    <Box>
<DashboardStats
        stats={projectStats}
        containerProps={{ marginBottom: "30px" }}
      />


      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <ProjectInfoCard
          projectName="Global Rollout"
          category="Manufacturing"
          actionLabel="View Completed tasks"
          onActionClick={() => alert("Completed tasks clicked")}
        />

        <Typography variant="h6" gutterBottom fontWeight="bold">
          Tasks
        </Typography>
        <Box>
          <DataGrid
            rows={taskRows}
            columns={taskColumns}
            pagination
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </Box>
  );
}
