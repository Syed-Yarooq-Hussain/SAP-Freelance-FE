"use client";

import { useLogout } from "@/actions/auth/logout";
import { useDeleteConsultantProfile } from "@/actions/consultants/useDeleteConsultantProfile";
import { DESKTOP_DRAWER_WIDTH } from "@/constants/dimensions";
import { getProfileRouteByRole } from "@/utils/roleRoutes";
import colors from "@/utils/styles/colors";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
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
import Image from "next/image";
import * as React from "react";
import ChatSection from "./ChatSection";
import ProfileAvatar from "./ProfileAvatar";
import ProfileMenu from "./ProfileMenu";
import { APP_ROUTES } from "@/utils/app_routes";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import { LogOutIcon, ChevronDown, SettingsIcon, LockIcon } from "lucide-react";
import { Roles } from "@/constants/roles";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { useToast } from "@/providers/ToastProvider";
import { logoutUser } from "@/lib/store/features/user/userSlice";

interface AppNavbarProps {
  showSidebar?: boolean;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ showSidebar = true }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const deleteProfile = useDeleteConsultantProfile();
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerType, setDrawerType] = React.useState<
    "chat" | "notification" | null
  >(null);
  const [signOutOpen, setSignOutOpen] = React.useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = React.useState(false);
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
  const dispatch = useAppDispatch()
  const { toast } = useToast();
  const handleLogout = () => {
    logout()
    dispatch(logoutUser())
  };
  const handleProfileClick = () => {
    const role = session?.user?.role;
    const route = getProfileRouteByRole(role);
    router.push(route);
  };
  

  const handleDeleteAccount = () => {
    deleteProfile.mutate(undefined, {
      onSuccess: () => {
        toast("Account deleted successfully", "success");
        setDeleteAccountOpen(false);
        dispatch(logoutUser());
        logout();
      },
      onError: (error: any) => {
        toast(error?.message || "Failed to delete account", "error");
        setDeleteAccountOpen(false);
      },
    });
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
        account: APP_ROUTES.CONSULTANT.ACCOUNT,
        changePassword: APP_ROUTES.CONSULTANT.CHANGE_PASSWORD,
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
  
  const navItemsMobile = [
    { label: "My Profile", path: navRoutes.profile, icon: ProfileIcon },
    { label: "Calendar", path: navRoutes.calendar, icon: CalendarMonthIcon },
    { label: "Account Settings", path: navRoutes.account, icon: SettingsIcon },
    { label: "Change Password", path: navRoutes.changePassword, icon: LockIcon }
  ]
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
          position: { xs: "static", md: "fixed" },
          width: { xs: "100%", md: showSidebar ? `calc(100% - 240px)` : "96%" },
          backgroundColor: "#F0F1F3",
          paddingY: 0.2,
          borderBottom: "1px solid #D9D9D9",
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
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
              <Image
                src="/images/logo-dashboard-large.png"
                alt="Logo"
                width={120}
                height={34}
                priority
                style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              mr: 1.5,
            }}
          >
            {navItems.map(({ label, path, icon: Icon }, index) => {
              const isActive = pathname === path;
              // const isProfileItem = path === APP_ROUTES.CONSULTANT.PROFILE;
              // const isCalendarItem = path === APP_ROUTES.CONSULTANT.CALENDAR;
              // const shouldHideCurrentNavButton =
              //   (isProfileItem && pathname === APP_ROUTES.CONSULTANT.PROFILE) ||
              //   (isCalendarItem && pathname === APP_ROUTES.CONSULTANT.CALENDAR);
              // if (shouldHideCurrentNavButton) return null;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => router.push(path ?? "")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-manrope transition-colors ${
                    isActive
                      ? "bg-brand-yellow text-brand-blue"
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
            <div className="w-[1px] bg-gray-300 h-5"/>
            <Tooltip title="Profile" arrow>
              <IconButton
                size="large"
                disableRipple
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ p: 0.5, }}
              >
                <Box className="flex items-center gap-2 px-2 py-1 bg-brand-yellow border border-gray-300 rounded-[8px]">
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
                  <Box className="flex flex-col items-start justify-center">
                    <p className="text-xxs font-medium">{user?.user?.username || 'User'}</p>
                    <p className="text-[7px] text-gray-800">{(user?.user?.module?.core ? user?.user?.module?.core.split(',')[0] : '') || ''}</p>
                  </Box>
                  <div>
                    <ChevronDown className="w-4 h-4 text-gray-800" />
                  </div>
                </Box>
              </IconButton>
            </Tooltip>
          </Box>

          {/* <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ p: 0 }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box> */}
        </Toolbar>

        <Menu
          anchorEl={mobileMoreAnchorEl}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { minWidth: 200 } } }}
        >
          {navItemsMobile.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path;
            // const isProfileItem = path === APP_ROUTES.CONSULTANT.PROFILE;
            // const isCalendarItem = path === APP_ROUTES.CONSULTANT.CALENDAR;
            // const shouldHideCurrentNavButton =
            //   (isProfileItem && pathname === APP_ROUTES.CONSULTANT.PROFILE) ||
            //   (isCalendarItem && pathname === APP_ROUTES.CONSULTANT.CALENDAR);
            // if (shouldHideCurrentNavButton) return null;
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
                onClick={() => {
                  handleMobileMenuClose();
                  setSignOutOpen(true);
                }}
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
        onLogoutClick={() => setSignOutOpen(true)}
        onProfileClick={handleProfileClick}
        onChangePasswordClick={() => router.push(APP_ROUTES.CONSULTANT.CHANGE_PASSWORD)}
        onDeleteAccount={() => setDeleteAccountOpen(true)}
        selectedPath={selectedMenu}
        user={{
          name:
            user?.user?.username?.replace(/([a-z])([A-Z])/g, "$1 $2") ??
            "User",
          avatar: user?.user?.avatar,
        }}
      /> }

      <ChatSection
        open={drawerOpen}
        type={drawerType || "chat"}
        onClose={() => setDrawerOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={signOutOpen}
        title="Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onCancel={() => setSignOutOpen(false)}
        onConfirm={() => {
          setSignOutOpen(false);
          handleLogout();
        }}
      />

      <ConfirmDeleteModal
        isOpen={deleteAccountOpen}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted."
        confirmLabel={deleteProfile.isPending ? "Deleting..." : "Delete Account"}
        cancelLabel="Cancel"
        variant="danger"
        onCancel={() => setDeleteAccountOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
};

export default AppNavbar;
