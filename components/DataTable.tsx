"use client";

import AppButton from "@/components/Button";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as React from "react";

export type DataTableProps<T> = {
  title: React.ReactNode;
  columns: GridColDef[];
  rows: T[];
  pageSize?: number;
  showViewMore?: boolean;
  onViewMoreClick?: () => void;
};

export default function DataTable<T>({
  title,
  columns,
  rows,
  pageSize = 10,
  showViewMore = false,
  onViewMoreClick,
}: DataTableProps<T>) {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" mb={1}>
        {title}
      </Typography>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize } } }}
          pageSizeOptions={[pageSize]}
          rowSelection={false}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fbff",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-cell": { fontSize: "0.875rem" },
            "& .MuiDataGrid-row": { backgroundColor: "#fff" },
          }}
        />
      </Box>

      {showViewMore && (
        <Box textAlign="center" mt={2}>
          <AppButton
            label="View More"
            color="primary"
            variant="text"
            fontColor="primary"
            onClick={onViewMoreClick}
          />
        </Box>
      )}
    </>
  );
}
