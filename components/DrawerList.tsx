"use client";

import { Roles } from "@/constants/roles";
import { APP_ROUTES } from "@/utils/app_routes";
import colors from "@/utils/styles/colors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleIcon from "@mui/icons-material/People";
import ProfileIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useMemo } from "react";
import DrawerListSkeleton from "./DrawerListSkeleton";
import { HyperText } from "./homepage/ui/hyperText";

type DrawerItem = {
  icon: React.ReactNode;
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
        { icon: <DashboardIcon />, label: "Dashboard", link: r.DASHBOARD },
        { icon: <ProfileIcon />, label: "Profile", link: r.PROFILE },
        { icon: <PeopleIcon />, label: "Consultants", link: r.CONSULTANTS },
        { icon: <PeopleIcon />, label: "Clients", link: r.CLIENT },
        { icon: <WorkIcon />, label: "Projects", link: r.PROJECTS },
        { icon: <EventNoteIcon />, label: "Interviews", link: r.INTERVIEWS },
        { icon: <PaymentIcon />, label: "Payments", link: r.PAYMENTS },
      ];
    }

    if (role === Roles.CLIENT) {
      const r = APP_ROUTES.CLIENT;

      return [
        { icon: <DashboardIcon />, label: "Dashboard", link: r.DASHBOARD },
        { icon: <ProfileIcon />, label: "Profile", link: r.PROFILE },
        { icon: <PeopleIcon />, label: "Consultant", link: r.CONSULTANT },
        { icon: <WorkIcon />, label: "Projects", link: r.PROJECTS },
        { icon: <EventNoteIcon />, label: "Interviews", link: r.INTERVIEWS },
        { icon: <DescriptionIcon />, label: "Documents", link: r.DOCUMENTS },
        { icon: <PaymentIcon />, label: "Payments", link: r.PAYMENTS },
      ];
    }

    const r = APP_ROUTES.CONSULTANT;

    return [
      { icon: <DashboardIcon />, label: "Dashboard", link: r.DASHBOARD },
      { icon: <ProfileIcon />, label: "Profile", link: r.PROFILE },
      { icon: <CalendarMonthIcon />, label: "Calendar", link: r.CALENDAR },
      { icon: <WorkIcon />, label: "Projects", link: r.PROJECTS },
      { icon: <EventNoteIcon />, label: "Interviews", link: r.INTERVIEWS },
      { icon: <DescriptionIcon />, label: "Documents", link: r.DOCUMENTS },
      { icon: <PaymentIcon />, label: "Payments", link: r.PAYMENTS },
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
                position: "relative", 
                bgcolor: isActive ? "#F2F3F7" : "transparent",
                overflow: "hidden",
                "&::before, &::after": {
                  content: '""',
                  position: "absolute",
                  width: "100%",
                  height: "3px",
                  background: "linear-gradient(to right, #8C00FF, #00FFFF)",
                  left: 0,
                  transform: "scaleX(0)",
                  transition: "transform 0.5s ease-out",
                },
                "&::before": {top: "-2px",transformOrigin: "left",},
                "&::after": {bottom: "-2px",transformOrigin: "right",},
                "&:hover::before, &:hover::after": {transform: "scaleX(1)",},
                "&:hover .hyper-text-letter": { color: "#000180",},
              }}
            >
            <ListItemIcon
              sx={{
                color: isActive ? colors.BLUE : "grey.700",
                minWidth: 32,
              }}
            >
              {item.icon}
            </ListItemIcon>

            {open && (
              <ListItemText
                primary={
                  <HyperText
                    text={item.label}
                    duration={800}
                    className="hyper-text-letter"
                    animateOnLoad={false}
                    framerProps={{
                      initial: { opacity: 0, y: -5 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: 2 },
                    }}
                  />
                }
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : 500,
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
