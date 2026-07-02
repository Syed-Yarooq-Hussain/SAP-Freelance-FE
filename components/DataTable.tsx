"use client";

import { colors } from "@/utils/styles/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Checkbox,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
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

export type DataTableVariant = "default" | "consultant";

export type DataTableProps<T extends GridValidRowModel> = {
  title: React.ReactNode;
  columns: GridColDef[];
  rows: T[];
  isTransparent?: boolean;
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
  variant?: DataTableVariant;
  titleIcon?: React.ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

const checkboxSx = {
  color: colors.BLUE,
  "&.Mui-checked": { color: colors.BLUE },
  "& .MuiSvgIcon-root": { fontSize: 22 },
};

const CONSULTANT_TABLE_HEAD_BG = "#F0EDE8";
const CONSULTANT_TABLE_ROW_BORDER = "#E8E4DE";

const getConsultantGridSx = (rowClickable: boolean) => ({
  border: "none",
  borderWidth: 0,
  borderRadius: 0,
  boxShadow: "none",
  backgroundColor: colors.LIGHT_YELLOW,
  outline: "none",
  "--DataGrid-t-color-background-base": colors.LIGHT_YELLOW,
  "--DataGrid-t-color-border-base": "transparent",
  "--DataGrid-t-header-background-base": CONSULTANT_TABLE_HEAD_BG,
  "--DataGrid-t-cell-background-pinned": colors.LIGHT_YELLOW,
  "--DataGrid-rowBorderColor": CONSULTANT_TABLE_ROW_BORDER,
  "--DataGrid-t-shadow-base": "none",
  "--DataGrid-t-shadow-overlay": "none",
  "--unstable_DataGrid-radius": "0px",
  "& .MuiDataGrid-main": {
    backgroundColor: colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-virtualScrollerContent": {
    backgroundColor: colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-topContainer": {
    backgroundColor: colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-bottomContainer": {
    backgroundColor: colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-scrollbarFiller": {
    backgroundColor: colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: CONSULTANT_TABLE_HEAD_BG,
    borderColor: "transparent",
    fontWeight: 600,
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: CONSULTANT_TABLE_HEAD_BG,
    borderBottom: `1px solid ${CONSULTANT_TABLE_ROW_BORDER}`,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
    fontSize: "0.6875rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#64748B",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-cell": {
    fontSize: "0.875rem",
    alignItems: "flex-start",
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight: 1.4,
    py: 1.5,
    borderBottom: `1px solid ${CONSULTANT_TABLE_ROW_BORDER}`,
    borderColor: CONSULTANT_TABLE_ROW_BORDER,
  },
  "& .MuiDataGrid-row": {
    backgroundColor: colors.LIGHT_YELLOW,
    cursor: rowClickable ? "pointer" : "default",
    transition: "background-color 0.2s ease",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: rowClickable ? "#F5F3F0" : colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-row.Mui-hovered": {
    backgroundColor: rowClickable ? "#F5F3F0" : colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: `1px solid ${CONSULTANT_TABLE_ROW_BORDER}`,
    backgroundColor: colors.LIGHT_YELLOW,
  },
  "& .MuiDataGrid-withBorderColor": {
    borderColor: CONSULTANT_TABLE_ROW_BORDER,
  },
});

const transparentGridSx = {
  border: "none",
  borderWidth: 0,
  borderRadius: 0,
  boxShadow: "none",
  backgroundColor: "transparent",
  outline: "none",
  "--DataGrid-t-color-background-base": "transparent",
  "--DataGrid-t-color-border-base": "transparent",
  "--DataGrid-t-header-background-base": "transparent",
  "--DataGrid-t-cell-background-pinned": "transparent",
  "--DataGrid-rowBorderColor": "transparent",
  "--DataGrid-t-shadow-base": "none",
  "--DataGrid-t-shadow-overlay": "none",
  "--unstable_DataGrid-radius": "0px",
  "& .MuiDataGrid-main": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-virtualScrollerContent": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-topContainer": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-bottomContainer": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-scrollbarFiller": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "transparent",
    borderBottom: "none",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    borderTop: "none",
    borderColor: "transparent",
  },
  "& .MuiDataGrid-row": {
    backgroundColor: "transparent",
    "--rowBorderColor": "transparent",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-row.Mui-hovered": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-withBorderColor": {
    borderColor: "transparent",
  },
};

export default function DataTable<T extends GridValidRowModel>({
  isTransparent = false,
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
  variant = "default",
  titleIcon,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
}: DataTableProps<T>) {
  const isConsultantVariant = variant === "consultant";
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
    const selectionCol: GridColDef = {
      field: "__selection",
      headerName: "",
      width: 52,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Checkbox
          indeterminate={
            selectedRows.size > 0 && selectedRows.size < rows.length
          }
          checked={selectedRows.size === rows.length && rows.length > 0}
          onChange={handleSelectAll}
          sx={checkboxSx}
        />
      ),
      renderCell: (params: GridRenderCellParams<T>) => (
        <Checkbox
          checked={selectedRows.has(params.id.toString())}
          onChange={() => handleSelect(params.id.toString())}
          onClick={(e) => e.stopPropagation()}
          sx={checkboxSx}
        />
      ),
    };

    if (showAvatar && avatarField) {
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
                sx={checkboxSx}
              />
            )
          : undefined,
        renderCell: (params: GridRenderCellParams<T>) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {enableSelection && (
              <Checkbox
                checked={selectedRows.has(params.id.toString())}
                onChange={() => handleSelect(params.id.toString())}
                sx={checkboxSx}
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
    }

    if (enableSelection) {
      return [selectionCol, ...columns];
    }

    return columns;
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

  const tableContent =
    rows && rows.length > 0 ? (
      <DataGrid
          rows={rows}
          columns={updatedColumns}
          showCellVerticalBorder={!isTransparent && !isConsultantVariant}
          showColumnVerticalBorder={!isTransparent && !isConsultantVariant}
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
                  height: "100%",
                  minHeight: 80,
                  m: 1,
                  borderRadius: isConsultantVariant ? 0 : isTransparent ? 0 : "12px",
                  border: isConsultantVariant || isTransparent ? "none" : "1px dashed",
                  borderColor: isConsultantVariant || isTransparent ? undefined : "#cbd5e1",
                  bgcolor: isConsultantVariant
                    ? colors.LIGHT_YELLOW
                    : isTransparent
                    ? "transparent"
                    : "#F0EDE8",
                }}
              >
                <Typography
                  sx={{
                    color: "#334155",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-manrope), sans-serif",
                  }}
                >
                  No data available
                </Typography>
              </Box>
            ),
            ...slots,
          }}
          slotProps={slotProps}
          sx={{
            ...(isConsultantVariant
              ? getConsultantGridSx(rowClickable)
              : isTransparent
              ? transparentGridSx
              : {
                  border: "none",
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
                }),
          }}
        />
    ) : (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          minHeight: 80,
          borderRadius: isConsultantVariant || isTransparent ? 0 : "12px",
          border: isConsultantVariant || isTransparent ? "none" : "1px dashed",
          borderColor: isConsultantVariant || isTransparent ? undefined : "#cbd5e1",
          bgcolor: isConsultantVariant
            ? colors.LIGHT_YELLOW
            : isTransparent
            ? "transparent"
            : "#F0EDE8",
        }}
      >
        <Typography
          sx={{
            color: "#334155",
            fontWeight: 500,
            fontSize: "0.875rem",
            fontFamily: isConsultantVariant
              ? undefined
              : "var(--font-manrope), sans-serif",
          }}
        >
          No {title} available
        </Typography>
      </Box>
    );

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={isConsultantVariant ? 2 : 1.5}
        sx={{ width: "100%", gap: 2, flexWrap: "wrap", px:2 }}
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
          {titleIcon}
          {title ? (
            <Typography
              variant="h6"
              fontWeight={isConsultantVariant ? 600 : "bold"}
              sx={{
                fontSize: isConsultantVariant ? "1.0625rem" : undefined,
                color: isConsultantVariant ? "#1E293B" : undefined,
              }}
            >
              {title}
            </Typography>
          ) : null}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {showSearch && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: { xs: "100%", sm: 280 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#fff",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#E2E8F0" },
                  "&:hover fieldset": { borderColor: "#CBD5E1" },
                  "&.Mui-focused fieldset": { borderColor: colors.BLUE },
                },
              }}
            />
          )}
          {actionButton && <Box>{actionButton}</Box>}
        </Box>
      </Stack>

      <Box
        sx={{
          width: "100%",
          ...(isConsultantVariant
            ? {
                overflow: "hidden",
                bgcolor: colors.LIGHT_YELLOW,
              }
            : !isTransparent
            ? {
                border: "1px solid #E8EAED",
                borderRadius: 2.5,
                overflow: "hidden",
                bgcolor: "#fff",
              }
            : {}),
        }}
      >
        {tableContent}
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
