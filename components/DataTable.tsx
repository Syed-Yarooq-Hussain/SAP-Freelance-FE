"use client";

import { colors } from "@/utils/styles/colors";
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
            "& .MuiDataGrid-cell": {
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Box>

      {showViewMore && (
        <Box textAlign="center" mt={2}>
          <Typography
            variant="body2"
            sx={{
              color: colors.BLUE,
              fontWeight: 500,
              fontSize: "0.875rem",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={onViewMoreClick}
          >
            View More
          </Typography>
        </Box>
      )}
    </>
  );
}
