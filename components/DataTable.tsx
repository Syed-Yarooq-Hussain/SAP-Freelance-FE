"use client";

import { colors } from "@/utils/styles/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  Checkbox,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import type {
  GridSlotsComponent,
  GridSlotsComponentsProps,
} from "@mui/x-data-grid";
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
  rowClickable?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showAvatar?: boolean;
  avatarField?: keyof T;
  enableSelection?: boolean;
  selectionActions?: React.ReactNode;
  actionButton?: React.ReactNode;
  slotProps?: GridSlotsComponentsProps;
  slots?: Partial<GridSlotsComponent>;
  onSelectionChange?: (selectedIds: string[]) => void;
  hidePagination?: boolean;
  selectedIds?: string[];
};

export default function DataTable<T extends GridValidRowModel>({
  title,
  columns,
  rows,
  pageSize = 10,
  showViewMore = false,
  onViewMoreClick,
  showBackButton = false,
  onBackClick,
  showAvatar = false,
  avatarField,
  enableSelection = false,
  selectionActions,
  actionButton,
  slotProps,
  slots,
  onSelectionChange,
  onRowClick,
  hidePagination = false,
  rowClickable = true,
  selectedIds = [],
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
    new Set()
  );

  React.useEffect(() => {
    const next = new Set(selectedIds.map(String));

    setSelectedRows((prev) => {
      if (prev.size === next.size && [...prev].every((id) => next.has(id))) {
        return prev;
      }

      return next;
    });
  }, [selectedIds]);

  const handleSelect = React.useCallback(
    (id: string) => {
      setSelectedRows((prev) => {
        const updated = new Set(prev);
        if (updated.has(id)) updated.delete(id);
        else updated.add(id);

        queueMicrotask(() => {
          onSelectionChange?.(Array.from(updated));
        });

        return updated;
      });
    },
    [onSelectionChange]
  );

  const handleSelectAll = React.useCallback(() => {
    setSelectedRows((prev) => {
      let updated: Set<string>;

      if (prev.size === rows.length) {
        updated = new Set();
      } else {
        updated = new Set(rows.map((r) => r.id.toString()));
      }

      queueMicrotask(() => {
        onSelectionChange?.(Array.from(updated));
      });

      return updated;
    });
  }, [rows, onSelectionChange]);

  const updatedColumns = React.useMemo(() => {
    if (!showAvatar || !avatarField) return columns;

    const avatarCol: GridColDef = {
      field: "avatar",
      headerName: "",
      width: enableSelection ? 90 : 60,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: enableSelection
        ? () => (
            <Checkbox
              indeterminate={
                selectedRows.size > 0 && selectedRows.size < rows.length
              }
              checked={selectedRows.size === rows.length && rows.length > 0}
              onChange={handleSelectAll}
              sx={{
                color: colors.BLUE,
                "&.Mui-checked": { color: colors.BLUE },
                "& .MuiSvgIcon-root": { fontSize: 22 },
              }}
            />
          )
        : undefined,
      renderCell: (params: GridRenderCellParams<T>) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {enableSelection && (
            <Checkbox
              checked={selectedRows.has(params.id.toString())}
              onChange={() => handleSelect(params.id.toString())}
              sx={{
                color: colors.BLUE,
                "&.Mui-checked": { color: colors.BLUE },
                "& .MuiSvgIcon-root": { fontSize: 22 },
              }}
            />
          )}
          <Avatar
            src={params.row[avatarField] as string}
            alt={params.row.name}
            sx={{
              width: 32,
              height: 32,
              border: selectedRows.has(params.id.toString())
                ? `2px solid ${colors.BLUE}`
                : "2px solid transparent",
            }}
          />
        </Box>
      ),
    };

    return [avatarCol, ...columns];
  }, [
    showAvatar,
    avatarField,
    columns,
    enableSelection,
    selectedRows,
    rows.length,
    handleSelect,
    handleSelectAll,
  ]);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
        sx={{ width: "100%" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        </Box>
        {actionButton && <Box>{actionButton}</Box>}
      </Stack>

      <Box sx={{ width: "100%" }}>
        {rows && rows?.length > 0 ? <DataGrid
          rows={rows}
          columns={updatedColumns}
          initialState={{
            pagination: { paginationModel: { pageSize } },
          }}
          pageSizeOptions={hidePagination ? [] : [pageSize]}
          {...(hidePagination ? {} : { pagination: true })}
          hideFooter={hidePagination}
          hideFooterPagination={hidePagination}
          hideFooterSelectedRowCount={hidePagination}
          disableRowSelectionOnClick
          checkboxSelection={false}
          onRowClick={(params, event) => {
            if (onRowClick) onRowClick(params, event);
          }}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 100,
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                No data available
              </Box>
            ),
            ...slots,
          }}
          slotProps={slotProps}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fbff",
            },
            "& .MuiDataGrid-columnHeader": {
              fontWeight: "bold",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.875rem",
              alignItems: "flex-start",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: 1.4,
              py: 1,
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#fff",
              transition: "background-color 0.2s ease",
              cursor: rowClickable ? "pointer" : "default",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: rowClickable ? "#f1f7ff" : "#fff",
            },
          }}
        /> : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No {title} available</p>
          </div>
        )}
      </Box>

      {/* {enableSelection && selectedRows.size > 0 && (
        <Box
          mt={1.5}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {selectedRows.size} selected
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {selectionActions}
          </Box>
        </Box>
      )} */}

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
