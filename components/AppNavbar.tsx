"use client";

import { useLogout } from "@/actions/auth/logout";
import { DESKTOP_DRAWER_WIDTH } from "@/constants/dimensions";
import { getProfileRouteByRole } from "@/utils/roleRoutes";
import colors from "@/utils/styles/colors";
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
  Tooltip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import AppTitle from "./AppTitle";
import ChatSection from "./ChatSection";
import ProfileAvatar from "./ProfileAvatar";
import ProfileMenu from "./ProfileMenu";
import { APP_ROUTES } from "@/utils/app_routes";

interface AppNavbarProps {
  showSidebar?: boolean;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ showSidebar = true }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const { data: session } = useSession();
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
  const handleProfileClick = () => {
    const role = session?.user?.role;
    const route = getProfileRouteByRole(role);
    router.push(route);
  };

  const profileRoute = getProfileRouteByRole(session?.user?.role);

  const selectedMenu = pathname === profileRoute ? "profile" : undefined;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          //width: showSidebar
//             ? { md: `calc(100% - ${240}px)` }
//             :  {md: "96%", sm: "85%"},
//        ml: showSidebar ? { md: `${DESKTOP_DRAWER_WIDTH}px` } : 0,
          width: showSidebar
            ? { xs: "85%", md: `calc(100% - 240px)` }
            : { xs: "85%", sm: "90%", md: "96%" },
          backgroundColor: "#E6EEF9",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              gap: 1.5,
              mr: 1.5,
            }}
          >
            <Tooltip title="Notifications" arrow>
              <IconButton
                sx={{ p: 1 }}
                onClick={() => openDrawer("notification")}
              >
                <NotificationsNoneIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Messages" arrow>
              <IconButton sx={{ p: 1 }} onClick={() => openDrawer("chat")}>
                <ChatOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile" arrow>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ p: 0.5 }}
              >
                <ProfileAvatar
                  name={
                    session?.user?.username?.replace(
                      /([a-z])([A-Z])/g,
                      "$1 $2"
                    ) ?? "User"
                  }
                  imageUrl={session?.user?.avatar}
                  size={24}
                  sx={{
                    border: "1.8px solid rgba(0,0,0,0.8)",
                    bgcolor: "rgba(25,118,210,0.12)",
                    color: colors.BLUE,
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                />
              </IconButton>
            </Tooltip>
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
            <IconButton
              size="large"
              onClick={handleProfileMenuOpen}
              sx={{ p: 0 }}
            >
              <ProfileAvatar
                name={
                  session?.user?.username?.replace(
                    /([a-z])([A-Z])/g,
                    "$1 $2"
                  ) ?? "User"
                }
                imageUrl={session?.user?.avatar}
                size={32}
              />
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
        onProfileClick={handleProfileClick}
        onChangePasswordClick={() => router.push(APP_ROUTES.CONSULTANT.CHANGE_PASSWORD)}
        selectedPath={selectedMenu}
        user={{
          name:
            session?.user?.username.replace(/([a-z])([A-Z])/g, "$1 $2") ??
            "User",
          avatar: session?.user?.avatar,
        }}
      />

      <ChatSection
        open={drawerOpen}
        type={drawerType || "chat"}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default AppNavbar;
