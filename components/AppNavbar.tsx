"use client";

import { useLogout } from "@/actions/auth/logout";
import { DESKTOP_DRAWER_WIDTH } from "@/constants/drawer";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import * as React from "react";
import AppTitle from "./AppTitle";

const AppNavbar: React.FC = () => {
  const { mutate: logout } = useLogout();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleLogout = () => logout();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DESKTOP_DRAWER_WIDTH}px)` },
        ml: { md: `${DESKTOP_DRAWER_WIDTH}px` },
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Box sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}>
          <IconButton size="large" edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
        </Box>

        <AppTitle />

        <Box
          sx={{
            flexGrow: 1,
            px: 3,
            display: { xs: 'none', sm: 'flex' },
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              px: 2,
              py: 0.5,
              width: { sm: '400px', md: '500px' },
            }}
          >
            <InputBase placeholder="Search…" fullWidth sx={{ fontSize: 14 }} />
          </Box>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <AccountCircle />
          </IconButton>
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton size="large" color="inherit" onClick={handleMobileMenuOpen}>
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <Menu
        anchorEl={mobileMoreAnchorEl}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton size="large" color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Account</p>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default AppNavbar;
