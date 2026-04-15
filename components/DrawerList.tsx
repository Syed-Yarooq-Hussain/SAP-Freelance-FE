"use client";

import { Roles } from "@/constants/roles";
import { APP_ROUTES } from "@/utils/app_routes";
import colors from "@/utils/styles/colors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarMonthIconOutline from "@mui/icons-material/CalendarMonthOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardIconOutline from "@mui/icons-material/DashboardOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import DescriptionIconOutline from "@mui/icons-material/DescriptionOutlined";

import EventNoteIcon from "@mui/icons-material/EventNote";
import EventNoteIconOutline from "@mui/icons-material/EventNoteOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsIconOutline from "@mui/icons-material/NotificationsOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import PaymentIconOutline from "@mui/icons-material/PaymentOutlined";
import PeopleIcon from "@mui/icons-material/People";
import PeopleIconOutline from "@mui/icons-material/PeopleOutlined";
import ProfileIcon from "@mui/icons-material/Person";
import ProfileIconOutline from "@mui/icons-material/PersonOutlined";  
import WorkIcon from "@mui/icons-material/Work";
import WorkIconOutline from "@mui/icons-material/WorkOutlined";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useMemo } from "react";
import DrawerListSkeleton from "./DrawerListSkeleton";

type DrawerItem = {
  icon: React.ReactNode;
  outlined: React.ReactNode;
  label: string;
  link: string;
};

type DrawerListProps = {
  open: boolean;
};

const DrawerList: FC<DrawerListProps> = ({ open }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const items: DrawerItem[] = useMemo(() => {
    if (!role) return [];
    if (role === Roles.ADMIN) {
      const r = APP_ROUTES.ADMIN;

      return [
        { icon: <DashboardIcon />, outlined: <DashboardIconOutline />, label: "Dashboard", link: r.DASHBOARD },
        { icon: <ProfileIcon />, outlined: <ProfileIconOutline />, label: "Profile", link: r.PROFILE },
        { icon: <PeopleIcon />, outlined: <PeopleIconOutline />, label: "Consultants", link: r.CONSULTANTS },
        { icon: <PeopleIcon />, outlined: <PeopleIconOutline />, label: "Modules", link: r.MODULES },
        { icon: <PeopleIcon />, outlined: <PeopleIconOutline />, label: "Industries", link: r.INDUSTRIES },
        { icon: <PeopleIcon />, outlined: <PeopleIconOutline />, label: "Clients", link: r.CLIENT },
        { icon: <WorkIcon />, outlined: <WorkIconOutline />, label: "Projects", link: r.PROJECTS },
        { icon: <EventNoteIcon />, outlined: <EventNoteIconOutline />, label: "Meetings", link: r.INTERVIEWS },
        { icon: <PaymentIcon />, outlined: <PaymentIconOutline />, label: "Payments", link: r.PAYMENTS },
        { icon: <NotificationsIcon />, outlined: <NotificationsIconOutline />, label: "Notifications", link: r.NOTIFICATIONS },
      ];
    }

    if (role === Roles.CLIENT) {
      const r = APP_ROUTES.CLIENT;

      return [
        { icon: <DashboardIcon />, outlined: <DashboardIconOutline />, label: "Dashboard", link: r.DASHBOARD },
        { icon: <ProfileIcon />, outlined: <ProfileIconOutline />, label: "Profile", link: r.PROFILE },
        { icon: <PeopleIcon />, outlined: <PeopleIconOutline />, label: "Consultant", link: r.CONSULTANT },
        { icon: <WorkIcon />, outlined: <WorkIconOutline />, label: "Projects", link: r.PROJECTS },
        { icon: <EventNoteIcon />, outlined: <EventNoteIconOutline />, label: "Meetings", link: r.INTERVIEWS },
        { icon: <DescriptionIcon />, outlined: <DescriptionIconOutline />, label: "Documents", link: r.DOCUMENTS },
        { icon: <PaymentIcon />, outlined: <PaymentIconOutline />, label: "Payments", link: r.PAYMENTS },
      ];
    }

    const r = APP_ROUTES.CONSULTANT;

    return [
      { icon: <DashboardIcon />, outlined: <DashboardIconOutline />, label: "Dashboard", link: r.DASHBOARD },
      { icon: <ProfileIcon />, outlined: <ProfileIconOutline />, label: "Profile", link: r.PROFILE },
      { icon: <CalendarMonthIcon />, outlined: <CalendarMonthIconOutline />, label: "Calendar", link: r.CALENDAR },
      // { icon: <WorkIcon />, label: "Projects", link: r.PROJECTS },
      // { icon: <EventNoteIcon />, label: "Meetings", link: r.INTERVIEWS },
      { icon: <DescriptionIcon />, outlined: <DescriptionIconOutline />, label: "Documents", link: r.DOCUMENTS },
      { icon: <PaymentIcon />, outlined: <PaymentIconOutline />, label: "Payments", link: r.PAYMENTS },
    ];
  }, [role]);

  if (status === "loading") {
    return <DrawerListSkeleton />;
  }

  return (
    <List>
      {items.map((item) => {
        const isActive =
          pathname === item.link || pathname.startsWith(`${item.link}/`);

        return (
          <ListItem key={item.link} disablePadding>
            <ListItemButton
              component={Link}
              href={item.link}
              sx={{
                py: 1.5,
                px: 2,
                m: 1,
                borderRadius: 2,
                bgcolor: isActive ? '#4A7AB5' : "transparent",
                // color: isActive ? "#fff" : colors.BLUE,
                color: isActive ? "#fff" : '#4A7AB5',
                "&:hover": {
                  // bgcolor: isActive ? "#14394D" : alpha(colors.BLUE, 0.12),
                  bgcolor: isActive ? "#4A7AB5" : alpha('#4A7AB5', 0.12),
                  color: isActive ? "#fff" : '#4A7AB5',
                },
                "& .MuiListItemIcon-root": {
                  color: "inherit",
                },
                "& .MuiListItemText-root, & .MuiListItemText-root .MuiTypography-root": {
                  color: "inherit",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  ml: -1,
                  color: "inherit",
                }}
              >
                {!isActive ? item.outlined : item.icon}
              </ListItemIcon>

              {open && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 14,
                    color: "inherit",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default DrawerList;
