"use client";

import { useLogout } from "@/actions/auth/logout";
import { DESKTOP_DRAWER_WIDTH } from "@/constants/drawer";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import * as React from "react";
import AppTitle from "./AppTitle";
import ProfileMenu from "./ProfileMenu";
import RIghtSideDrawer from "./RIghtSideDrawer";

const AppNavbar: React.FC = () => {
  const { mutate: logout } = useLogout();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerType, setDrawerType] = React.useState<
    "chat" | "notification" | null
  >(null);

  const openDrawer = (type: "chat" | "notification") => {
    setDrawerType(type);
    setDrawerOpen(true);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMobileMoreAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleLogout = () => logout();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DESKTOP_DRAWER_WIDTH}px)` },
          ml: { md: `${DESKTOP_DRAWER_WIDTH}px` },
          backgroundColor: "#4285f4",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
              <IconButton size="large" edge="start" color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>
            <AppTitle />
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton
              size="large"
              color="inherit"
              onClick={() => openDrawer("notification")}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              onClick={() => openDrawer("chat")}
            >
              <Badge badgeContent={4} color="error">
                <ChatOutlinedIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircleOutlinedIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>

        <Menu
          anchorEl={mobileMoreAnchorEl}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => openDrawer("chat")}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <ChatOutlinedIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem onClick={() => openDrawer("notification")}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton size="large" color="inherit">
              <AccountCircleOutlinedIcon />
            </IconButton>
            <p>Account</p>
          </MenuItem>
        </Menu>
      </AppBar>

      <ProfileMenu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onLogoutClick={handleLogout}
        user={{
          name: "Moni Roy",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        }}
      />

      <RIghtSideDrawer
        open={drawerOpen}
        type={drawerType || "chat"}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default AppNavbar;
