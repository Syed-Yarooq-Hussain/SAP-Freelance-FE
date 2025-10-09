"use client";

import {
  DESKTOP_DRAWER_WIDTH,
  MOBILE_DRAWER_WIDTH,
} from "@/constants/dimensions";
import { Box, CssBaseline, Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import React, { FC } from "react";
import AppNavbar from "./AppNavbar";
import DrawerList from "./DrawerList";

type ISidebarProps = {
  children: React.ReactNode;
};

const Sidebar: FC<ISidebarProps> = ({ children }) => {
  const theme = useTheme();
  const open = useMediaQuery(theme.breakpoints.up("md"));

  const appBarHeight = theme.mixins.toolbar.minHeight;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppNavbar />

      <Drawer
        variant="permanent"
        open={true}
        sx={{
          width: open ? DESKTOP_DRAWER_WIDTH : MOBILE_DRAWER_WIDTH,
          "& .MuiDrawer-paper": {
            width: open ? DESKTOP_DRAWER_WIDTH : MOBILE_DRAWER_WIDTH,
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
            width: "100%",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 1.5,
            py: 1,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: 100, sm: 120, md: 140 },
              height: 40,
            }}
          >
            <Image
              src="/vx9-logo-02.png"
              alt="Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
        </Box>

        <DrawerList open={open} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          marginTop: `${appBarHeight}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
