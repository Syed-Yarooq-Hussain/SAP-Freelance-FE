"use client";

import { colors } from "@/utils/styles/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export type AdminClientRow = {
  id: number;
  avatar: string;
  name: string;
  activeprojects: number;
  completedprojects: number;
  draftprojects: number;
  locked?: boolean;
};

export const getAdminClientColumns = (
  onToggleLock: (id: number) => void
): GridColDef<AdminClientRow>[] => [
  { field: "name", headerName: "Name", flex: 1 },
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

export const adminClientRows: AdminClientRow[] = [
  {
    id: 1,
    avatar: "/images/team1.jpg",
    name: "Marvin McKinney",
    activeprojects: 4,
    completedprojects: 0,
    draftprojects: 3,
    locked: false,
  },
  {
    id: 2,
    avatar: "/images/team2.jpg",
    name: "Savannah Nguyen",
    activeprojects: 0,
    completedprojects: 2,
    draftprojects: 2,
    locked: true,
  },
  {
    id: 3,
    avatar: "/images/team3.jpg",
    name: "Albert Flores",
    activeprojects: 1,
    completedprojects: 0,
    draftprojects: 4,
    locked: false,
  },
  {
    id: 4,
    avatar: "/images/team1.jpg",
    name: "Marvin McKinney",
    activeprojects: 1,
    completedprojects: 4,
    draftprojects: 5,
    locked: false,
  },
  {
    id: 5,
    avatar: "/images/team2.jpg",
    name: "Savannah Nguyen",
    activeprojects: 2,
    completedprojects: 0,
    draftprojects: 4,
    locked: true,
  },
  {
    id: 6,
    avatar: "/images/team3.jpg",
    name: "Albert Flores",
    activeprojects: 2,
    completedprojects: 5,
    draftprojects: 0,
    locked: false,
  },
  {
    id: 7,
    avatar: "/images/team1.jpg",
    name: "Marvin McKinney",
    activeprojects: 1,
    completedprojects: 2,
    draftprojects: 1,
    locked: false,
  },
  {
    id: 8,
    avatar: "/images/team2.jpg",
    name: "Savannah Nguyen",
    activeprojects: 5,
    completedprojects: 3,
    draftprojects: 0,
    locked: true,
  },
  {
    id: 9,
    avatar: "/images/team3.jpg",
    name: "Albert Flores",
    activeprojects: 5,
    completedprojects: 1,
    draftprojects: 1,
    locked: false,
  },
  {
    id: 10,
    avatar: "/images/team1.jpg",
    name: "Marvin McKinney",
    activeprojects: 3,
    completedprojects: 5,
    draftprojects: 5,
    locked: false,
  },
  {
    id: 11,
    avatar: "/images/team2.jpg",
    name: "Savannah Nguyen",
    activeprojects: 2,
    completedprojects: 4,
    draftprojects: 4,
    locked: true,
  },
  {
    id: 12,
    avatar: "/images/team3.jpg",
    name: "Albert Flores",
    activeprojects: 3,
    completedprojects: 5,
    draftprojects: 0,
    locked: false,
  },
  {
    id: 13,
    avatar: "/images/team1.jpg",
    name: "Marvin McKinney",
    activeprojects: 3,
    completedprojects: 3,
    draftprojects: 0,
    locked: false,
  },
];
