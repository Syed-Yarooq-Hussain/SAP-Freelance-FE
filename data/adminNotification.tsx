"use Notification";

import { colors } from "@/utils/styles/colors";
import { Box, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

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
  headerName: "Action",
  flex: 1,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  renderCell: (params) => {
    const row = params.row;
    const isActive = row.enabled;

    return (
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
        <Tooltip title={isActive ? "Deactivate" : "Activate"}>
          <IconButton
            size="small"
            onClick={() => onToggleEnable(row.id)}
            sx={{
              color: isActive ? colors.GREEN : colors.DARK_RED,
              "&:hover": {
                bgcolor: isActive
                  ? `${colors.GREEN}15`
                  : `${colors.DARK_RED}15`,
              },
            }}
          >
            {isActive ? (
              <ToggleOnIcon sx={{ fontSize: 30 }} />
            ) : (
              <ToggleOffIcon sx={{ fontSize: 30 }} />
            )}
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
  {
    id: 4,
    title: "New Project Assigned",
    message: "A new project has been assigned to Consultant Marvin McKinney.",
    type: "Project",
    target: "Marvin McKinney",
    createdAt: "2025-01-12",
    enabled: true,
  },
  {
    id: 5,
    title: "Payment Pending",
    message: "Invoice #INV-2034 is pending approval.",
    type: "Payment",
    target: "Client – Savannah Nguyen",
    createdAt: "2025-01-11",
    enabled: false,
  },
  {
    id: 6,
    title: "Interview Scheduled",
    message: "Interview scheduled for Albert Flores on Jan 15.",
    type: "User",
    target: "Albert Flores",
    createdAt: "2025-01-10",
    enabled: true,
  },
  {
    id: 7,
    title: "New Project Assigned",
    message: "A new project has been assigned to Consultant Marvin McKinney.",
    type: "Project",
    target: "Marvin McKinney",
    createdAt: "2025-01-12",
    enabled: true,
  },
  {
    id: 8,
    title: "Payment Pending",
    message: "Invoice #INV-2034 is pending approval.",
    type: "Payment",
    target: "Client – Savannah Nguyen",
    createdAt: "2025-01-11",
    enabled: false,
  },
  {
    id: 9,
    title: "Interview Scheduled",
    message: "Interview scheduled for Albert Flores on Jan 15.",
    type: "User",
    target: "Albert Flores",
    createdAt: "2025-01-10",
    enabled: true,
  },
  {
    id: 10,
    title: "New Project Assigned",
    message: "A new project has been assigned to Consultant Marvin McKinney.",
    type: "Project",
    target: "Marvin McKinney",
    createdAt: "2025-01-12",
    enabled: true,
  },
  {
    id: 11,
    title: "Payment Pending",
    message: "Invoice #INV-2034 is pending approval.",
    type: "Payment",
    target: "Client – Savannah Nguyen",
    createdAt: "2025-01-11",
    enabled: false,
  },
  {
    id: 12,
    title: "Interview Scheduled",
    message: "Interview scheduled for Albert Flores on Jan 15.",
    type: "User",
    target: "Albert Flores",
    createdAt: "2025-01-10",
    enabled: true,
  },
];
