"use client";

import {
  DESKTOP_DRAWER_WIDTH,
  MOBILE_DRAWER_WIDTH,
} from "@/constants/dimensions";
import { Box, CssBaseline, Drawer } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import AppNavbar from "./AppNavbar";
import DrawerList from "./DrawerList";
import DrawerListSkeleton from "./DrawerListSkeleton";

type ISidebarProps = {
  children: React.ReactNode;
};

const Sidebar: FC<ISidebarProps> = ({ children }) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setOpen(window.innerWidth >= theme.breakpoints.values.md);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [theme.breakpoints.values.md]);

  if (!mounted) return null;

  const appBarHeight = theme.mixins.toolbar.minHeight;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppNavbar />

      <Drawer
        variant="permanent"
        sx={{
          width: open ? DESKTOP_DRAWER_WIDTH : MOBILE_DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? DESKTOP_DRAWER_WIDTH : MOBILE_DRAWER_WIDTH,
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
