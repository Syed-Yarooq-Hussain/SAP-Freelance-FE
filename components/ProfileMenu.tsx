"use client";

import colors from "@/utils/styles/colors";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import * as React from "react";
import ProfileAvatar from "./ProfileAvatar";

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onProfileClick?: () => void;
  onChangePasswordClick?: () => void;
  onLogoutClick?: () => void;
  onDeleteAccount?: () => void;
  user?: {
    name: string;
    avatar?: string;
  };
  selectedPath?: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onProfileClick,
  onChangePasswordClick,
  onLogoutClick,
  onDeleteAccount,
  selectedPath,
  user = { name: "User" },
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    onClose();
  };

  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    onDeleteAccount?.();
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <>
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
              borderRadius: 2.5,
              minWidth: 220,
              overflow: "hidden",
              p: 0,
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
            px: 2,
            py: 1.5,
            bgcolor: colors.BLUE,
            color: "white",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <ProfileAvatar name={user.name} imageUrl={user.avatar} size={36} />
          <Typography variant="subtitle1" fontWeight={600}>
            {user.name}
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          selected={selectedPath === "profile"}
          onClick={() => {
            onProfileClick?.();
            onClose();
          }}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            px: 2,
            "&.Mui-selected": {
              bgcolor: "rgba(25, 118, 210, 0.12)",
            },
            "&.Mui-selected:hover": {
              bgcolor: "rgba(25, 118, 210, 0.18)",
            },
            "&.Mui-selected::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: 4,
              bgcolor: "primary.main",
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Account Settings</Typography>
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

        {/* <Divider /> */}

        {/* <MenuItem
          onClick={handleDeleteClick}
          sx={{
            py: 0.75,
            "&:hover": {
              bgcolor: "rgba(211, 47, 47, 0.08)",
            },
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "#d32f2f" }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ color: "#d32f2f" }}>
            Delete Account
          </Typography>
        </MenuItem> */}

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

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This action cannot be
            undone. All your data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
            autoFocus
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileMenu;
