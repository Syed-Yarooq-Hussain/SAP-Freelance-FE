"use client";

import DataTable from "@/components/DataTable";
import { Box } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

interface PaymentProps<T extends GridValidRowModel = GridValidRowModel> {
  title: string;
  columns: GridColDef<T>[];
  rows: T[];
}

export default function Payment<
  T extends GridValidRowModel = GridValidRowModel
>({ title, columns, rows }: PaymentProps<T>) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <DataTable title={title} columns={columns} rows={rows} pageSize={10} />
    </Box>
  );
}
