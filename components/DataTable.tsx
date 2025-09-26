"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export type DataTableProps<T> = {
  title: string;
  columns: GridColDef[];
  rows: T[];
  pageSize?: number;
};

export default function DataTable<T>({
  title,
  columns,
  rows,
  pageSize = 5,
}: DataTableProps<T>) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[pageSize]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pageSize,
                },
              },
            }}
            disableRowSelectionOnClick
          />
        </div>
      </CardContent>
    </Card>
  );
}
