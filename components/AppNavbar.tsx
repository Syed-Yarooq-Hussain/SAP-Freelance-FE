"use client";

import { useLogout } from "@/actions/auth/logout";
import { DESKTOP_DRAWER_WIDTH } from "@/constants/dimensions";
import { getProfileRouteByRole } from "@/utils/roleRoutes";
import colors from "@/utils/styles/colors";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ProfileIcon from "@mui/icons-material/Person";
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
import { useAppSelector } from "@/lib/store/hook";
import { User, Calendar, LogOutIcon } from "lucide-react";
import { Roles } from "@/constants/roles";

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
  const {user} = useAppSelector(state => state.user)
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

  const role = session?.user?.role as number | undefined;
  const getNavRoutes = () => {
    if (role === Roles.CONSULTANT)
      return {
        dashboard: APP_ROUTES.CONSULTANT.DASHBOARD,
        profile: APP_ROUTES.CONSULTANT.PROFILE,
        calendar: APP_ROUTES.CONSULTANT.CALENDAR,
      };
    // if (role === Roles.CLIENT)
    //   return {
    //     dashboard: APP_ROUTES.CLIENT.DASHBOARD,
    //     profile: APP_ROUTES.CLIENT.PROFILE,
    //     calendar: APP_ROUTES.CLIENT.,
    //   };
    // if (role === Roles.ADMIN)
    //   return {
    //     dashboard: APP_ROUTES.ADMIN.DASHBOARD,
    //     profile: APP_ROUTES.ADMIN.PROFILE,
    //     calendar: APP_ROUTES.ADMIN.CALENDAR,
    //   };
    return {
      dashboard: "/",
      profile: "/",
      calendar: "/",
    };
  };
  const navRoutes = getNavRoutes();
  const navItems = [
    { label: "My Profile", path: navRoutes.profile, icon: ProfileIcon },
    { label: "Calendar", path: navRoutes.calendar, icon: CalendarMonthIcon },
  ] as const;

  const handleNavClick = (path: string) => {
    router.push(path);
    handleMobileMenuClose();
  };

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
          backgroundColor: "white",
          paddingY:1,
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
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = pathname === path;
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => router.push(path ?? "")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
            {/* <Tooltip title="Notifications" arrow>
              <IconButton
                sx={{ p: 1 }}
                onClick={() => openDrawer("notification")}
              >
                <NotificationsNoneIcon />
              </IconButton>
            </Tooltip> */}

            {/* <Tooltip title="Messages" arrow>
              <IconButton sx={{ p: 1 }} onClick={() => openDrawer("chat")}>
                <ChatOutlinedIcon />
              </IconButton>
            </Tooltip> */}
            <div className="w-[1px] bg-gray-300 h-8"/>
            <Tooltip title="Profile" arrow>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ p: 0.5, }}
              >
                <ProfileAvatar
                  name={
                    user?.user?.username?.replace(
                      /([a-z])([A-Z])/g,
                      "$1 $2"
                    ) ?? "User"
                  }
                  imageUrl={user?.user?.avatar}
                  size={28}
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
          slotProps={{ paper: { sx: { minWidth: 200 } } }}
        >
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path;
            return (
              <MenuItem
                key={path}
                onClick={() => handleNavClick(path ?? "")}
                selected={isActive}
                sx={{
                  gap: 1.5,
                  bgcolor: isActive ? "rgba(25, 118, 210, 0.08)" : undefined,
                  color: isActive ? "#1976d2" : "text.primary",
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </MenuItem>
            );
          })}
           <MenuItem
                onClick={handleLogout}
                sx={{
                  gap: 1.5,
                }}
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Logout</span>
              </MenuItem>
        </Menu>
      </AppBar>

      {<ProfileMenu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onLogoutClick={handleLogout}
        onProfileClick={handleProfileClick}
        onChangePasswordClick={() => router.push(APP_ROUTES.CONSULTANT.CHANGE_PASSWORD)}
        selectedPath={selectedMenu}
        user={{
          name:
            user?.user?.username.replace(/([a-z])([A-Z])/g, "$1 $2") ??
            "User",
          avatar: user?.user?.avatar,
        }}
      /> }

      <ChatSection
        open={drawerOpen}
        type={drawerType || "chat"}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default AppNavbar;
