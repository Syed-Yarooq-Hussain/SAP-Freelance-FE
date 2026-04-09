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
import { ChevronLeftIcon, ChevronRightIcon, LogOut, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/lib/store/hook";
import { useLogout } from "@/actions/auth/logout";

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
  const handleLogout = () => {
    logout();
  }
  const theme = useTheme();
  const session = useSession();
  const { user } = useAppSelector((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);

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
      <AppNavbar showSidebar={expanded} />

      <Drawer
        variant="permanent"
        open={expanded}
        sx={{
          backgroundColor: expanded ? "white" : "#F0F1F3",
        }}
        PaperProps={{
          onMouseEnter: () => setHoverOpen(true),
          onMouseLeave: () => setHoverOpen(false),
          sx:{
            bgcolor: "#F0F1F3",
          }
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
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              height: 160,
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              px: 2,
            }}
          >
            <Box sx={{ position: "relative", width: 140, height: 40, pt:12 }}>
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

          <div>
            <div className="h-[0.5px] w-11/12 mx-auto bg-[#DBDBDB]/50 mb-8 rounded-full" />
            {mounted ? <DrawerList open={expanded} /> : <DrawerListSkeleton />}
          </div>
        </Box>

        <Box sx={{ mt: "auto"}}>
          <button
            onClick={handleLogout}
            className={`w-full bg-brand-blue border border-white/20 text-white transition-colors ${
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
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
              </>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </button>
        </Box>
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
        component="main"
        sx={{
          flexGrow: 1,
          px: 0,
          py:2,
          mt: `${appBarHeight}px`,
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
