"use client";

import * as React from "react";
import { AppBar, Toolbar, Box, IconButton, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import AppTitle from "./AppTitle";

const AppNavbar: React.FC = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}>
          <IconButton size="large" edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
        </Box>

        <AppTitle />

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton size="large" edge="end" color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton size="large" color="inherit">
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
