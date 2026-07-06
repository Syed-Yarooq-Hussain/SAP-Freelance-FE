"use client";

import { AdminClientRow } from "@/types/admin";
import { colors } from "@/utils/styles/colors";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const getAdminClientColumns = (
  onToggleLock: (id: number, locked: boolean) => void
): GridColDef<AdminClientRow>[] => [
  { field: "name", headerName: "Name", flex: 1.5 },
  { field: "email", headerName: "Email", flex: 2 },
  { field: "phone", headerName: "Phone", flex: 1.2 },
  { field: "activeprojects", headerName: "Active Projects", flex: 1 },
  { field: "completedprojects", headerName: "Completed Projects", flex: 1 },
  { field: "draftprojects", headerName: "Draft Projects", flex: 1 },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<AdminClientRow>) => {
      const row = params.row;
      const isLocked = !!row.locked;

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip
            title={isLocked ? "Locked (cannot be changed)" : "Lock client"}
          >
            <span>
              <IconButton
                size="small"
                disabled={isLocked}
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
        </Box>
      );
    },
  },
];
