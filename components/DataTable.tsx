"use client";

import { colors } from "@/utils/styles/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValidRowModel,
  MuiEvent,
} from "@mui/x-data-grid";
import * as React from "react";

export type DataTableProps<T extends GridValidRowModel> = {
  title: React.ReactNode;
  columns: GridColDef[];
  rows: T[];
  pageSize?: number;
  showViewMore?: boolean;
  onViewMoreClick?: () => void;
  onRowClick?: (
    params: GridRowParams<T>,
    event: MuiEvent<React.MouseEvent>
  ) => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showAvatar?: boolean;
  avatarField?: keyof T;
};

export default function DataTable<T extends GridValidRowModel>({
  title,
  columns,
  rows,
  pageSize = 10,
  showViewMore = false,
  onViewMoreClick,
  onRowClick,
  showBackButton = false,
  onBackClick,
  showAvatar = false,
  avatarField,
}: DataTableProps<T>) {
  const updatedColumns = React.useMemo(() => {
    if (!showAvatar || !avatarField) return columns;
    return [
      {
        field: "avatar",
        headerName: "",
        width: 60,
        sortable: false,
        renderCell: (params: GridRenderCellParams<T>) => (
          <Avatar
            src={params.row[avatarField] as string}
            alt={params.row.name}
            sx={{ width: 32, height: 32 }}
          />
        ),
      },
      ...columns,
    ];
  }, [showAvatar, avatarField, columns]);

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        {showBackButton && (
          <IconButton
            onClick={onBackClick}
            size="small"
            sx={{ color: "text.primary" }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        )}
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Stack>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={updatedColumns}
          initialState={{ pagination: { paginationModel: { pageSize } } }}
          pageSizeOptions={[pageSize]}
          rowSelection={false}
          onRowClick={onRowClick}
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
