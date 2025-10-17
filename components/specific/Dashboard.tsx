"use client";

import Announcement from "@/components/Announcement";
import SidebarInfo, {
  SidebarSectionInfo,
} from "@/components/DashboardSidebarInfo";
import DataTable from "@/components/DataTable";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import VisibilityChart from "@/components/VisibilityChart";
import { Box, Grid } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

interface TableData<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  columns: GridColDef<T>[];
  rows: T[];
}

interface DashboardProps<T extends GridValidRowModel = GridValidRowModel> {
  announcements: string[];
  stats: StatCardProps[];
  projectTable: TableData<T>;
  financeTable: TableData<T>;
  sidebarSections: SidebarSectionInfo[];
}

const Dashboard = <T extends GridValidRowModel = GridValidRowModel>({
  announcements,
  stats,
  projectTable,
  financeTable,
  sidebarSections,
}: DashboardProps<T>) => {
  return (
    <Box>
      <Announcement items={announcements} />
      <DashboardStats stats={stats} containerProps={{ marginBottom: "30px" }} />

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
              bgcolor: "background.paper",
              mb: 2,
            }}
          >
            <DataTable
              title={projectTable.title}
              columns={projectTable.columns}
              rows={projectTable.rows}
              pageSize={5}
              showViewMore
            />
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "background.paper",
              mb: 2,
            }}
          >
            <DataTable
              title={financeTable.title}
              columns={financeTable.columns}
              rows={financeTable.rows}
              pageSize={5}
              showViewMore
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <SidebarInfo sections={sidebarSections} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
