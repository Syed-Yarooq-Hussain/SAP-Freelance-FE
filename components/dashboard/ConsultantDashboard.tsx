"use client";

import SidebarInfo from "@/components/DashboardSidebarInfo";
import DashboardStats from "@/components/StatsCardList";
import { StatCardProps } from "@/components/StatCard";
import VisibilityChart from "@/components/VisibilityChart";
import { Box, Button, Chip, ChipProps, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const interviewColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "product", headerName: "Product", flex: 1 },
  { field: "datetime", headerName: "Date – Time", flex: 2 },
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
    subtitle: 360,
    color: "linear-gradient(135deg, #4680FF, #002486ff)",
    icon: "QueryStatsIcon",
  },
  {
    title: "Interview Scheduled",
    subtitle: 10,
    color: "linear-gradient(135deg, #00997B, #008638ff)",
    icon: "PeopleAltIcon",
  },
  {
    title: "Projected Monthly Revenue",
    subtitle: "$3000",
    color: "linear-gradient(135deg, #FFB64E, #865000ff)",
    icon: "CurrencyExchangeIcon",
  },
  {
    title: "Invoices Status",
    subtitle: "13",
    color: "linear-gradient(135deg, #FF5471, #860016ff)",
    icon: "BallotIcon",
  },
];

export default function ConsultantDashboard() {
  return (
    <Box>
      <DashboardStats
        stats={consultantStats}
        containerProps={{ marginBottom: "30px" }}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              mb: 2,
              bgcolor: "background.paper",
            }}
          >
            <VisibilityChart />
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              mb: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Project Pipeline
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
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Financial List
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
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <SidebarInfo />
        </Grid>
      </Grid>
    </Box>
  );
}
