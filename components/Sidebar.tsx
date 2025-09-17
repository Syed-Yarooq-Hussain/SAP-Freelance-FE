"use client";

import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Drawer, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@mui/material/styles";
import React, { FC } from "react";
import DrawerList from "./DrawerList";
import AppNavbar from "./AppNavbar";

const desktopdrawerWidth = 240;
const mobiledrawerWidth = 60;

type ISidebarProps = {
  children: React.ReactNode;
};

const Sidebar: FC<ISidebarProps> = ({ children }) => {
  const theme = useTheme();
  const open = useMediaQuery(theme.breakpoints.up("md"));

  const appBarHeight = theme.mixins.toolbar.minHeight;

  const drawerItems = [
    { icon: <InboxIcon />, label: "Inbox", link: "/inbox" },
    { icon: <MailIcon />, label: "Mail", link: "/mail" },
    { icon: <MailIcon />, label: "Drafts", link: "/drafts" },
    { icon: <InboxIcon />, label: "Starred", link: "/starred" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppNavbar />

      <Drawer
        variant="permanent"
        open={true}
        sx={{
          width: open ? desktopdrawerWidth : mobiledrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? desktopdrawerWidth : mobiledrawerWidth,
            position: "fixed",
            boxSizing: "border-box",

            top: {
              xs: "56px",
              sm: "64px",
            },
            height: {
              xs: "calc(100% - 56px)",
              sm: "calc(100% - 64px)",
            },
          },
        }}
      >
        <DrawerList items={drawerItems} open={open} />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: `${appBarHeight}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
