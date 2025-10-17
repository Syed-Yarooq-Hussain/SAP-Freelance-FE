"use client";

import DataTable from "@/components/DataTable";
import { StatCardProps } from "@/components/StatCard";
import DashboardStats from "@/components/StatsCardList";
import { Roles } from "@/constants/roles";
import { APP_ROUTES } from "@/utils/app_routes";
import { Box } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProjectProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  stats: StatCardProps[];
  columns: GridColDef<T>[];
  rows: T[];
}

export default function Project<
  T extends GridValidRowModel = GridValidRowModel
>({ title, stats, columns, rows }: ProjectProps<T>) {
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role;

  let routeBase = "";
  if (role === Roles.CLIENT) routeBase = APP_ROUTES.CLIENT.PROJECTS;
  else if (role === Roles.CONSULTANT)
    routeBase = APP_ROUTES.CONSULTANT.PROJECTS;
  else if (role === Roles.ADMIN) routeBase = APP_ROUTES.ADMIN.PROJECTS;

  return (
    <Box>
      <DashboardStats stats={stats} containerProps={{ marginBottom: "30px" }} />

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <DataTable
          title={title}
          columns={columns}
          rows={rows}
          pageSize={10}
          onRowClick={(params) => {
            if (routeBase) router.push(`${routeBase}/${params.id}`);
          }}
        />
      </Box>
    </Box>
  );
}
