"use client";

import { AdminConsultantRow } from "@/types/admin";
import { colors } from "@/utils/styles/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const getAdminConsultantColumns = (
  onToggleLock: (id: number, locked: boolean) => void
): GridColDef<AdminConsultantRow>[] => [
  { field: "name", headerName: "Name" },
  { field: "coremodules", headerName: "Modules (Core)", flex: 2 },
  { field: "othersmodules", headerName: "Modules (Others)", flex: 2 },
  { field: "experience", headerName: "Experience", flex: 1 },
  { field: "hourlyRate", headerName: "Hourly Rate", flex: 1 },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<AdminConsultantRow>) => {
      const row = params.row;
      const isLocked = !!row.locked;

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip
            title={isLocked ? "Locked (cannot be changed)" : "Lock consultant"}
          >
            <span>
              <IconButton
                size="small"
                disabled={isLocked} // 🚫 DISABLE on locked rows
                onClick={() => onToggleLock(row.id, isLocked)}
                sx={{
                  color: isLocked ? colors.RED : colors.GRAY_DARK,
                  "&:hover": {
                    bgcolor: isLocked ? "transparent" : "action.hover",
                  },
                }}
              >
                {isLocked ? (
                  <LockOutlinedIcon fontSize="small" />
                ) : (
                  <LockOpenOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </span>
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
