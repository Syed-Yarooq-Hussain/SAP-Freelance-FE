"use client";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import * as React from "react";

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onProfileClick?: () => void;
  onChangePasswordClick?: () => void;
  onLogoutClick?: () => void;
  user?: {
    name: string;
    avatar?: string;
  };
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onProfileClick,
  onChangePasswordClick,
  onLogoutClick,
  user = { name: "Moni Roy" },
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          elevation: 4,
          sx: {
            mt: 0,
            minWidth: 200,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow:
              "0px 2px 8px rgba(0,0,0,0.1), 0px 4px 20px rgba(0,0,0,0.08)",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1,
          py: 1,
          bgcolor: "#4285f4",
          color: "white",
        }}
      >
        <Avatar src={user.avatar} alt={user.name} />
        <Typography variant="subtitle1" fontWeight={600}>
          {user.name}
        </Typography>
      </Box>

      <Divider />

      <MenuItem
        onClick={() => {
          onProfileClick?.();
          onClose();
        }}
        sx={{ py: 0.75 }}
      >
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Profile</Typography>
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={() => {
          onChangePasswordClick?.();
          onClose();
        }}
        sx={{ py: 0.75 }}
      >
        <ListItemIcon>
          <VpnKeyIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Change password</Typography>
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={() => {
          onLogoutClick?.();
          onClose();
        }}
        sx={{ py: 0.75 }}
      >
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Logout</Typography>
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
