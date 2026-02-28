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
  const [mounted, setMounted] = useState(true);
  const [open, setOpen] = useState(true);

  // useEffect(() => {
  //   setMounted(true);

  //   const handleResize = () => {
  //     setOpen(window.innerWidth >= theme.breakpoints.values.md);
  //   };

  //   handleResize();
  //   window.addEventListener("resize", handleResize);

  //   return () => window.removeEventListener("resize", handleResize);
  // }, [theme.breakpoints.values.md]);

  const appBarHeight = theme.mixins.toolbar.minHeight;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppNavbar showSidebar={open} />

      <Drawer
        variant="permanent"
        // sx={{
        //   width: open ? DESKTOP_DRAWER_WIDTH : MOBILE_DRAWER_WIDTH,
        //   flexShrink: 0,
        //   "& .MuiDrawer-paper": {
        //     width: open ? DESKTOP_DRAWER_WIDTH : MOBILE_DRAWER_WIDTH,
        //     boxSizing: "border-box",
        //   },
        // }}
        open={open}
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
            <Image
              src="/vx9-logo-02.png"
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
        </Box>

        {mounted ? <DrawerList open={open} /> : <DrawerListSkeleton />}
        <DrawerHeader>
            <IconButton
              onClick={() => setOpen(!open)}
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
              sx={{
                borderRadius: 2,
                bgcolor: "action.hover",
                width: '100%',
                height: 40,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "action.selected",
                  transform: "scale(1.08)",
                },
                "&:active": {
                  transform: "scale(0.96)",
                },
                "& svg": {
                  transition: "transform 0.25s ease",
                  transform: open ? "rotate(0deg)" : "rotate(180deg)",
                },
              }}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon style={{ width: 20, height: 20 }} />
              ) : (
                <ChevronLeftIcon style={{ width: 20, height: 20 }} />
              )}
            </IconButton>
        </DrawerHeader>
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
