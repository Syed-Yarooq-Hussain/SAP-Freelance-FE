"use client";

import SidebarInfo from "@/components/DashboardSidebarInfo";
import { Box, Paper, Typography, Button, Chip, ChipProps } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityChart from "@/components/VisibilityChart";
import DashboardStats from "@/components/DashboardStats";
import { StatCardProps } from "@/components/StatCard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import BallotIcon from "@mui/icons-material/Ballot";

const interviewColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "product", headerName: "Product", flex: 1 },
  { field: "datetime", headerName: "Date – Time", flex: 1 },
  { field: "duration", headerName: "Duration", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => {
      const color = params.value === "Confirmed" ? "success" : "error";
      return <Chip label={params.value} color={color} size="small" />;
    },
  },
];

const interviewRows = [
  {
    id: 1,
    name: "Apple Watch",
    product: "Ariba",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Apple Watch",
    product: "Ariba",
    datetime: "12.09.2019 – 12.58 PM",
    duration: "30 min",
    status: "Confirmed",
  },
  {
    id: 3,
    name: "Apple Watch",
    product: "hana",
    datetime: "12.09.2019 – 12.53 PM",
    duration: "30 min",
    status: "Canceled",
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
];

const consultantStats: StatCardProps[] = [
  {
    title: "Appeared in search",
    value: 360,
    color: "#4680FF",
    icon: <QueryStatsIcon fontSize="large" />,
  },
  {
    title: "Scheduled Interview",
    value: 10,
    color: "#00997B",
    icon: <PeopleAltIcon fontSize="large" />,
  },
  {
    title: "Hourly rates",
    value: "$30 / hr",
    color: "#FFB64E",
    icon: <CurrencyExchangeIcon fontSize="large" />,
  },
  {
    title: "Skills",
    value: "4hana",
    color: "#FF5471",
    icon: <BallotIcon fontSize="large" />,
  },
];

export default function ConsultantDashboard() {
  return (
    <main style={{ padding: "10px" }}>
      <Box mb={3}>
        <DashboardStats stats={consultantStats} />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2, mb: 2 }}>
            <VisibilityChart />
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Interviews
            </Typography>
            <Box>
              <DataGrid
                rows={interviewRows}
                columns={interviewColumns}
                hideFooterPagination
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#0066ffff",
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>
            <Box textAlign="center" mt={1}>
              <Button size="small">View more</Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Tasks
            </Typography>
            <Box>
              <DataGrid
                rows={taskRows}
                columns={taskColumns}
                hideFooterPagination
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
              />
            </Box>
            <Box textAlign="center" mt={1}>
              <Button size="small">View more</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <SidebarInfo />
        </Grid>
      </Grid>
    </main>
  );
}
