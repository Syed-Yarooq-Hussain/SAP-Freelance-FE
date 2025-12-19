"use client";

import { AdminConsultantRow } from "@/types/admin";
import { colors } from "@/utils/styles/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const getAdminConsultantColumns = (
  onToggleLock: (id: number) => void
): GridColDef<AdminConsultantRow>[] => [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "coremodules", headerName: "Modules (Core)", flex: 1.5 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 1.5 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<AdminConsultantRow>) => {
      const row = params.row;
      const isLocked = !!row.locked;

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title={isLocked ? "Unlock" : "Lock"}>
            <IconButton
              size="small"
              onClick={() => onToggleLock(row.id)}
              sx={{
                color: isLocked ? colors.RED : colors.GRAY_DARK,
                "&:hover": {
                  bgcolor: isLocked ? `${colors.RED}15` : "action.hover",
                },
              }}
            >
              {isLocked ? (
                <LockOutlinedIcon fontSize="small" />
              ) : (
                <LockOpenOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => console.log("Edit", row)}
              sx={{
                color: colors.BLUE,
                "&:hover": { bgcolor: `${colors.BLUE}15` },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => console.log("Delete", row)}
              sx={{
                color: colors.RED,
                "&:hover": { bgcolor: `${colors.RED}15` },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  },
];
