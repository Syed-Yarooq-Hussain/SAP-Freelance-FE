"use client";

import {
  DESKTOP_DRAWER_WIDTH,
  MOBILE_DRAWER_WIDTH,
} from "@/constants/dimensions";
import { Box, Button, CssBaseline, IconButton, Drawer as MuiDrawer, Tooltip } from "@mui/material";
import { CSSObject, styled, Theme, useTheme } from "@mui/material/styles";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import AppNavbar from "./AppNavbar";
import DrawerList from "./DrawerList";
import DrawerListSkeleton from "./DrawerListSkeleton";
import BottomNav from "@/components/BottomNav";
import { ChevronLeftIcon, ChevronRightIcon, LogOut, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import { useLogout } from "@/actions/auth/logout";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { logoutUser } from "@/lib/store/features/user/userSlice";

type ISidebarProps = {
  children: React.ReactNode;
};
const drawerWidth = 240;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));



const Sidebar: FC<ISidebarProps> = ({ children }) => {
  const { mutate: logout } = useLogout();
  const dispatch = useAppDispatch()
  const handleLogout = () => {
    dispatch(logoutUser())
    logout();
  }
  const theme = useTheme();
  const session = useSession();
  const { user } = useAppSelector((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const expanded = open || hoverOpen;

  const appBarHeight = theme.mixins.toolbar.minHeight;

  useEffect(() => {
    if (session.status === "authenticated") {
      setMounted(true);
    }
  }, [session.status]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={expanded}
        sx={{
          backgroundColor: expanded ? "white" : "#F0F1F3",
          display: { xs: "none", md: "block" },
        }}
        PaperProps={{
          onMouseEnter: () => setHoverOpen(true),
          onMouseLeave: () => setHoverOpen(false),
          sx: {
            bgcolor: "#F0F1F3",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxSizing: "border-box",
          },
        }}
      >
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "center" : "center",
            height: 64,
            px: 1,
          }}
        >
          <Image
            src="/vx9-logo-02.png"
            alt="Logo"
            width={120}
            height={40}
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              height: "auto",
            }}
            priority
          />
        </Box> */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              px: 2,
              pt: { xs: 1.5, sm: 2 },
              pb: { xs: 1, sm: 1.5 },
              minHeight: { xs: 72, sm: 88, md: 104 },
              maxHeight: { xs: 88, sm: 104, md: 120 },
              "@media (max-height: 640px)": {
                minHeight: 56,
                maxHeight: 72,
                pt: 1,
                pb: 0.5,
              },
              "@media (max-height: 520px)": {
                minHeight: 48,
                maxHeight: 56,
                pt: 0.5,
                pb: 0.5,
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: 112, sm: 128, md: 140 },
                height: { xs: 28, sm: 32, md: 36 },
                "@media (max-height: 640px)": {
                  width: 100,
                  height: 24,
                },
                "@media (max-height: 520px)": {
                  width: 88,
                  height: 22,
                },
              }}
            >
              {expanded ?<Image
                src="/vx9-logo-02.png"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              /> : (
                <Image
                  src="/images/logo-small.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              )}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="h-[0.5px] w-11/12 mx-auto bg-[#DBDBDB]/50 mb-4 sm:mb-8 rounded-full shrink-0" />
            {mounted ? <DrawerList open={expanded} /> : <DrawerListSkeleton />}
          </Box>
        </Box>

        <Box sx={{ flexShrink: 0, mt: 0 }}>
          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            className={`w-full  border hover:bg-brand-blue/20  border-white/20 text-brand-blue transition-colors ${
              expanded
                ? "px-3 py-3 flex items-center justify-between gap-3"
                : "h-11 py-3 flex items-center justify-center"
            }`}
          >
            {expanded ? (
              <>
                <Box className="flex flex-col items-start text-left justify-center min-w-0">
                  <p className="text-xs font-medium truncate w-full mb-1">
                    {user?.user?.username || "User"}
                  </p>
                  <p className="text-[7px] text-white/80 truncate w-full">
                    {(user?.user?.module?.core
                      ? user.user.module.core.split(",")[0]
                      : "") || ""}
                  </p>
                </Box>
                <div className="bg-brand-blue text-white p-3 rounded-xl">
                  <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                </div>
              </>
            ) : (
              <div className="bg-brand-blue text-white p-3 rounded-lg">
                  <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                </div>
            )}
          </button>
        </Box>

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
        {/* <DrawerHeader>
          <Tooltip title={expanded ? "Collapse sidebar" : "Expand sidebar"} placement="right" arrow>
            <IconButton
              onClick={() => setOpen(!open)}
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "10px",
                bgcolor: "action.hover",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                  transform: "scale(1.1)",
                  boxShadow: 1,
                },
                "&:active": {
                  transform: "scale(0.92)",
                  transitionDuration: "0.1s",
                },
                "& svg": {
                  width: 16,
                  height: 16,
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
                },
              }}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </Tooltip>
        </DrawerHeader> */}
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: "100%",
        }}
      >
        <AppNavbar showSidebar={expanded} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 0,
            py: 2,
            mt: { xs: 0, md: `${appBarHeight}px` },
            minHeight: "100vh",
            pb: { xs: "70px", md: "0px" },
          }}
        >
          {children}
        </Box>
      </Box>

      <BottomNav />
    </Box>
  );
};

export default Sidebar;
