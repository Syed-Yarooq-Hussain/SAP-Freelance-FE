"use Notification";

import { colors } from "@/utils/styles/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export type AdminNotificationRow = {
  id: number;
  title: string;
  message: string;
  type: "System" | "Project" | "Payment" | "User";
  target: string;
  createdAt: string;
  enabled: boolean;
};

export const getAdminNotificationColumns = (
  onToggleEnable: (id: number) => void
): GridColDef<AdminNotificationRow>[] => [
  {
    field: "title",
    headerName: "Title",
    flex: 1.5,
  },
  {
    field: "message",
    headerName: "Message",
    flex: 3,
  },
  {
    field: "type",
    headerName: "Type",
    flex: 1,
  },
  {
    field: "target",
    headerName: "Target",
    flex: 1.5,
  },
  {
    field: "createdAt",
    headerName: "Date",
    flex: 1,
  },
  {
    field: "action",
    headerName: "Actions",
    flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const row = params.row;

      return (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title={row.enabled ? "Disable" : "Enable"}>
            <IconButton
              size="small"
              onClick={() => onToggleEnable(row.id)}
              sx={{
                color: row.enabled ? colors.GREEN : colors.GRAY_DARK,
                "&:hover": {
                  bgcolor: row.enabled
                    ? `${colors.GREEN}15`
                    : "action.hover",
                },
              }}
            >
              {row.enabled ? (
                <LockOpenOutlinedIcon fontSize="small" />
              ) : (
                <LockOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              sx={{ color: colors.BLUE }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              sx={{ color: colors.RED }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  },
];

export const adminNotificationRows: AdminNotificationRow[] = [
  {
    id: 1,
    title: "New Project Assigned",
    message: "A new project has been assigned to Consultant Marvin McKinney.",
    type: "Project",
    target: "Marvin McKinney",
    createdAt: "2025-01-12",
    enabled: true,
  },
  {
    id: 2,
    title: "Payment Pending",
    message: "Invoice #INV-2034 is pending approval.",
    type: "Payment",
    target: "Client – Savannah Nguyen",
    createdAt: "2025-01-11",
    enabled: false,
  },
  {
    id: 3,
    title: "Interview Scheduled",
    message: "Interview scheduled for Albert Flores on Jan 15.",
    type: "User",
    target: "Albert Flores",
    createdAt: "2025-01-10",
    enabled: true,
  },
];
