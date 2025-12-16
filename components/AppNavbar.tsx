"use client";

import { useLogout } from "@/actions/auth/logout";
import { DESKTOP_DRAWER_WIDTH } from "@/constants/dimensions";
import Person2Icon from '@mui/icons-material/Person2';
import ForumIcon from '@mui/icons-material/ForumOutlined';
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';import {
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

interface AppNavbarProps {
  showSidebar?: boolean;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ showSidebar = true }) => {
  const { mutate: logout } = useLogout();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerType, setDrawerType] = React.useState<
    "chat" | "notification" | null
  >(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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
          width: showSidebar
            ? { md: `calc(100% - ${DESKTOP_DRAWER_WIDTH}px)` }
            : "100%",
          ml: showSidebar ? { md: `${DESKTOP_DRAWER_WIDTH}px` } : 0,
          backgroundColor: "#DAE6F2",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center",fontFamily:"serif", gap: 1 }}>
            {showSidebar && (
              <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
                <IconButton size="large" edge="start" color="inherit">
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
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
                <NotificationsActiveIcon sx={{ color: "#f59e0b", fontSize:28}} />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              onClick={() => openDrawer("chat")}
            >
              <Badge badgeContent={4} color="error">
                <ForumIcon sx={{ color: "#3b82f6" }}/>
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Person2Icon sx={{ color: "#22c55e" ,fontSize:32 }}/>
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
                <ForumIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem onClick={() => openDrawer("notification")}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsActiveIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton size="large" color="inherit">
              <Person2Icon />
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
