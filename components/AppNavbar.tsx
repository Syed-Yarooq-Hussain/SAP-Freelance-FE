"use client";

import { useLogout } from "@/actions/auth/logout";
import { DESKTOP_DRAWER_WIDTH } from "@/constants/dimensions";
import Person2Icon from '@mui/icons-material/Person2';
import ForumIcon from '@mui/icons-material/ForumOutlined';
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsNoneSharpIcon from '@mui/icons-material/NotificationsNoneSharp';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  TextField, InputAdornment 
} from "@mui/material";
import * as React from "react";
import AppTitle from "./AppTitle";
import ProfileMenu from "./ProfileMenu";
import ChatSection  from "./ChatSection";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";


interface AppNavbarProps {
  showSidebar?: boolean;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ showSidebar = true }) => {
  const { mutate: logout } = useLogout();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerType, setDrawerType] = React.useState<
    "chat" | "notification" | null
  >(null);

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
  const [focused, setFocused] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: showSidebar
            ? { md: `calc(100% - ${DESKTOP_DRAWER_WIDTH}px)` }
            : "100%",
          ml: showSidebar ? { md: `${DESKTOP_DRAWER_WIDTH}px` } : 0,
          background: "linear-gradient(#23618C, #4094CF, #3BB2F5)",
          height: 44,
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
          <Box sx={{ display: "flex", alignItems: "center",fontFamily:"serif", gap: 1 }}>
            {showSidebar && (
              <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
                <IconButton size="large" edge="start" color="inherit">
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            <Box
              sx={{
                fontSize: "2rem",
                color: "#ffffff",
                position: "relative",
                display: "inline-block",
                "&::after, &::before": {
                  content: '""',
                  position: "absolute",
                  width: "100%",
                  height: "2px",
                  background: "linear-gradient(to right, #8C00FF, #00ffff)",
                  left: 0,
                  transform: "scaleX(0)",
                  transition: "transform 0.5s ease-out",
                },
                "&::after": {
                  bottom: "-2px",
                  transformOrigin: "right",
                },
                "&::before": {
                  top: "-2px",
                  transformOrigin: "left",
                },
                "&:hover::after, &:hover::before": {
                  transform: "scaleX(1)",
                },
              }}
            >
            <AppTitle />
            </Box>

          </Box>
          
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: focused ? 420 : 250,
                transition: "all 0.4s ease",
              }}
            >
            <TextField
              fullWidth
              placeholder="Search..."
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: focused ? "#3b82f6" : "#070A8C",
                        transform: focused ? "scale(1.2)" : "scale(1)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
          sx={{
            borderColor: "#070A8C",
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              backgroundColor: "#fff",
              transition: "all 0.4s ease",
              "& fieldset": {
                borderColor: focused ? "#070A8C" : "#070A8C",
                borderWidth: focused ? "2px" : "1px",
              },
              "& input": {
                padding: "6px 10px",
                fontSize: "0.85rem",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#070A8C",
                boxShadow: "0 0 0 4px rgba(59,130,246,0.15)",
              },
            },
          }}
        />
      </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton
              size="medium"
              color="inherit"
              onClick={() => openDrawer("notification")}
            >
              <Badge badgeContent={17} color="error">
                <Box
                  sx={{
                    display: "inline-block",
                    "&:hover": {
                      animation: "bellShake 0.6s ease-in-out",
                    },
                    "@keyframes bellShake": {
                      "0%": { transform: "rotate(0deg)" },
                      "20%": { transform: "rotate(40deg)" },
                      "40%": { transform: "rotate(-40deg)" },
                      "60%": { transform: "rotate(20deg)" },
                      "80%": { transform: "rotate(-20deg)" },
                      "100%": { transform: "rotate(0deg)" },
                    },
                  }}
                >
                  🔔
                </Box>
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              onClick={() => openDrawer("chat")}
            >
              <Badge badgeContent={4} color="error">
                <ForumIcon
                  sx={{
                    color: "#fff",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      animation: "chatBounce 0.5s ease",
                    },
                    "@keyframes chatBounce": {
                      "0%": { transform: "scale(1)" },
                      "30%": { transform: "scale(1.45)" },
                      "50%": { transform: "scale(0.95)" },
                      "70%": { transform: "scale(1.38)" },
                      "100%": { transform: "scale(1)" },
                    },
                  }}
                />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              sx={{
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 1,
                  borderRadius: "50%",
                  border: "2px solid #070A8C",
                  opacity: 0,
                  transform: "scale(0.8)",
                  transition: "all 0.35s ease",
                },
                "&:hover::after": {
                  opacity: 1,
                  transform: "scale(0.9)",
                },
              }}
            >
              <Box component="span" sx={{ color: "#22c55e" }}>
                👨🏻‍💼
              </Box>
            </IconButton>


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
        >
          <MenuItem onClick={() => openDrawer("chat")}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <ForumIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem onClick={() => openDrawer("notification")}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsNoneSharpIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton size="large" color="inherit">
              <Person2Icon />
            </IconButton>
            <p>Account</p>
          </MenuItem>
        </Menu>
      </AppBar>

      <ProfileMenu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onLogoutClick={handleLogout}
        user={{
          name: "Moni Roy",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        }}
      />

      <ChatSection
        open={drawerOpen}
        type={drawerType || "chat"}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default AppNavbar;
