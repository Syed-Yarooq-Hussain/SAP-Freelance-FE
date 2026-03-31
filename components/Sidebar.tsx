"use client";

import {
  DESKTOP_DRAWER_WIDTH,
  MOBILE_DRAWER_WIDTH,
} from "@/constants/dimensions";
import { Box, CssBaseline, IconButton, Drawer as MuiDrawer, Tooltip } from "@mui/material";
import { CSSObject, styled, Theme, useTheme } from "@mui/material/styles";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import AppNavbar from "./AppNavbar";
import DrawerList from "./DrawerList";
import DrawerListSkeleton from "./DrawerListSkeleton";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useSession } from "next-auth/react";

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
  const theme = useTheme();
  const session = useSession();
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
          backgroundColor: expanded ? "white" : "#3088B7",
        }}
        PaperProps={{
          onMouseEnter: () => setHoverOpen(true),
          onMouseLeave: () => setHoverOpen(false),
          sx:{
            bgcolor: "primary.main",
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
        <Box
          sx={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Box sx={{ position: "relative", width: 140, height: 40 }}>
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

        {mounted ? <DrawerList open={expanded} /> : <DrawerListSkeleton />}
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
          p: 2,
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
