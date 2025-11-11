"use client";

import Announcement from "@/components/Announcement";
import SidebarInfo, {
  SidebarSectionInfo,
} from "@/components/DashboardSidebarInfo";
import DataTable from "@/components/DataTable";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import { Box, Grid } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import React from "react";

interface TableData<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  columns: GridColDef<T>[];
  rows: T[];
  pageSize?: number;
  showAvatar?: boolean;
  avatarField?: string;
  enableSelection?: boolean;
  showViewMore?: boolean;
  selectionActions?: React.ReactNode;
}

interface DashboardProps<T extends GridValidRowModel = GridValidRowModel> {
  announcements?: string[];
  stats: StatCardProps[];
  projectTable: TableData<T>;
  financeTable?: TableData<T>;
  sidebarSections?: SidebarSectionInfo[];
  chart?: React.ReactNode;
}

const Dashboard = <T extends GridValidRowModel = GridValidRowModel>({
  announcements,
  stats,
  projectTable,
  financeTable,
  sidebarSections,
  chart,
}: DashboardProps<T>) => {
  return (
    <Box>
      {announcements && announcements.length > 0 && (
        <Announcement items={announcements} />
      )}

      <DashboardStats stats={stats} containerProps={{ marginBottom: "30px" }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: sidebarSections ? 9 : 12 }}>
          {chart && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                mb: 2,
                bgcolor: "background.paper",
              }}
            >
              {chart}
            </Box>
          )}

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "background.paper",
              mb: financeTable ? 2 : 0,
            }}
          >
            <DataTable
              title={projectTable.title}
              columns={projectTable.columns}
              rows={projectTable.rows}
              pageSize={projectTable.pageSize ?? 5}
              showAvatar={projectTable.showAvatar ?? false}
              avatarField={projectTable.avatarField}
              enableSelection={projectTable.enableSelection ?? false}
              showViewMore={projectTable.showViewMore ?? false}
              selectionActions={projectTable.selectionActions}
            />
          </Box>

          {financeTable && (
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
                pageSize={financeTable.pageSize ?? 5}
                showAvatar={financeTable.showAvatar ?? false}
                avatarField={financeTable.avatarField}
                enableSelection={financeTable.enableSelection ?? false}
                showViewMore={financeTable.showViewMore ?? false}
              />
            </Box>
          )}
        </Grid>

        {sidebarSections && sidebarSections.length > 0 && (
          <Grid size={{ xs: 12, md: 3 }}>
            <SidebarInfo sections={sidebarSections} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
